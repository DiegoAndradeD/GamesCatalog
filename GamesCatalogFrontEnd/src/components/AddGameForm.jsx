import React, {useState, useEffect} from 'react';
import {useNavigate  } from 'react-router-dom';
import CustomDropdown from './CustomDropdown';
import axios from 'axios';

/**
   * This component represents the form for adding games to the catalog.
   * Only users with the ROLE_ADMIN role are allowed to access this form.
   * It includes fields to provide detailed information about the game, such as title, developer, description, etc.
   * In addition, it allows the loading of a cover image of the game.
   *
   * @component
   */

const AddGameForm = () => {
    const navigate = useNavigate();


    // Function to navigate to Catalog Page("/") using the useNavigate

    const navigateToCatalog = () => {
      navigate('/');
    };


    // Defines the initial states for the form fields

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [developer, setDeveloper] = useState('');
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [selectedPlatform, setSelectedPlatform] = useState('');
    const [releaseDate, setReleaseDate] = useState('');
    const [ageRating, setAgeRating] = useState('');
    const [price, setPrice] = useState('');
    const [cover, setCover] = useState(null);

    //Defines the state for the chars that will be counted from the description and maxlength
    const [remainingChars, setRemainingChars] = useState(500);
    const maxLength = 500;

    //State for cover preview
    const [preview, setPreview] = useState();

    //States for the user roles and loggedIn state
    const [userRoles, setUserRoles] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    /**
     * Gets the user information from the api.
     * Calls the check-login method from the api to check if the user is logged in
     * If so, calls the get-user-info method to get and set the roles of the logged user
     */
    const fetchUserInfo = async () => {
      try {
          const response = await axios.get("/api/check-login", { withCredentials: true });
          setIsLoggedIn(response.data);
          console.log(response.data);
  
          if (response.data === true) {
              const userInfoResponse = await axios.get("/api/get-user-info", { withCredentials: true });
              console.log(userInfoResponse.data.roles[0].name);
              let roles = userInfoResponse.data.roles[0].name;
              if (roles.includes('ROLE_ADMIN')) {
                setUserRoles(roles);
              } else {
                navigate('/');
              }
          }
      } catch (error) {
          setIsLoggedIn(false);
          console.error(error);
      }
  }

    //Arrays to genre and platform options
    const genreOptions = ["Action", "Adventure", "RPG", "Shooter", "Strategy", "Sports", "Simulation", "Puzzle", "Horror", "Fighting", "Platformer", "Racing"];
    const platformOptions = ["PC", "PS4", "PS5", "PS3", "PS2", "PS1", "XBOX", "XBOX360", "XBOXONE", "XBOX SERIES X/S", "Nintendo Switch", "Nintendo 3DS", "Nintendo Wii", "Nintendo Wii U", "Nintendo GameCube", "Sega Genesis", "Sega Saturn", "Sega Dreamcast", "MOBILE"];


    //UseEffect to update the cover preview
    useEffect(() => {
      fetchUserInfo();

      if(!cover) {
        setPreview(undefined);
        return;
      }

      const objectUrl = URL.createObjectURL(cover);
      setPreview(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    }, [cover]);

    //Function to select the cover
    const onSelectCover = (e) => {
      if(!e.target.files || e.target.files.length === 0) {
        setCover(undefined);
        return;
      }
      setCover(e.target.files[0]);
    };

    //Calculate the description remaining chars and updates it
    const handleDescription = (e) => {
  
      const newDescription = e.target.value;
      const currentLength = newDescription.length;
      const remaining = maxLength - currentLength;
    
      if (remaining >= 0) {
        setDescription(newDescription);
        setRemainingChars(remaining);
      }
    };

    //Adds genre to selected Genres while checking for repeated genres
    const handleGenreChange = (genre) => {
      if(selectedGenres.includes(genre)) {
        setSelectedGenres(selectedGenres.filter((selected) => selected !== genre));
      } else {
        setSelectedGenres([...selectedGenres, genre]);
      }
    };

    //Adds platform to selected Platform while checking for repeated platform
    const handlePlatformChange = (platform) => {
      if(selectedPlatform.includes(platform)) {
        setSelectedPlatform(selectedPlatform.filter((selected) => selected !== platform));
      } else {
        setSelectedPlatform([...selectedPlatform, platform]);
      }
    }

    /**
     * Function to handle the form submition
     * Creates the formData and appends the data from the form fields to it
     * Calls the method to add a game from the API
     * @param {*} event 
     */
    const handleFormSubmit = async (event) => {
      event.preventDefault();
  
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('developer', developer);
      formData.append('genre', selectedGenres);
      formData.append('platform', selectedPlatform);
      formData.append('releaseDate', releaseDate);
      formData.append('ageRating', ageRating);
      formData.append('price', price);
      formData.append('cover', cover);

      try {
        console.log(formData);
        await axios.post('/api/addGame', formData);
        navigateToCatalog();
        console.log('Game added successfully!');
      } catch (error) {
        console.error('Error adding game:', error);
      }
    };
    
    return (
      <div>
      {userRoles.includes("ROLE_ADMIN")  ? (
        <div>
          <div className='container mt-3' id='addGameFormContainer'>
        <h1 className='mb-3'>Catalog Game Registration</h1>
        <form onSubmit={handleFormSubmit}>

        <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="title" className="form-label">Title:</label>
              <input type="text" className="form-control" id="title" required autoFocus autoComplete='false' placeholder='Title' value={title} onChange={(e) => setTitle(e.target.value)}/>
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="developer" className="form-label">Developer:</label>
              <input type="text" className="form-control" id="developer" required autoFocus autoComplete='false' placeholder='Developer' value={developer} onChange={(e) => setDeveloper(e.target.value)} />
            </div>
          </div>

          <div className="row">
          <div className="col-md-6 mb-3">
          <p>Platform:</p>
            <CustomDropdown
              options={platformOptions}
              selectedOptions={selectedPlatform}
              onOptionToggle={handlePlatformChange}
            />
          </div>
          <div className="col-md-6 mb-3">
            <p>Genre:</p>
            <CustomDropdown
              options={genreOptions}
              selectedOptions={selectedGenres}
              onOptionToggle={handleGenreChange}
            />
          </div>
          </div>
          
          <div className='row'>
          <div className='col-md-6 mb-3'>
              <label htmlFor="ageRating" className='form-label'>Age Rating</label>
              <input type="text" name="ageRating" id="ageRating" className='form-control' required autoFocus autoComplete='false' placeholder='Age Rating' value={ageRating} onChange={(e) => setAgeRating(e.target.value)} />
            </div>
            <div className='col-md-6 mb-3'>
              <label htmlFor="releaseDate" className='form-label'>Release Date</label>
              <input type="date" name="releaseDate" id="releaseDate" className='form-control' required autoFocus autoComplete='false' placeholder='Release Date' value={releaseDate} onChange={(e) => setReleaseDate(e.target.value)} />
            </div>
          </div>

          <div className='row'>
          <div className='col-md-6 mb-3'>
              <label htmlFor="price" className='form-label'>Price</label>
              <input type="number" name="price" id="price" className='form-control' required autoFocus autoComplete='false' placeholder='Price' value={price} onChange={(e) => setPrice(e.target.value)} />
            </div>
            <div className='col-md-6 mb-3'>
              <label htmlFor="cover" className='form-label'>Cover:</label>
              <input type='file'  id="cover" className='form-control' required  onChange={onSelectCover} />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="description" className="form-label">Description:</label>
              <textarea className="form-control" id="description" required autoFocus autoComplete='false' placeholder='Description' rows="10" value={description} onChange={handleDescription} maxLength={maxLength} ></textarea>
              <p>Description Max Length: <span>{remainingChars}</span></p>
            </div>
            <div className="col-md-6 mb-5" id='previewContainer'>
              <label htmlFor="coverImg">Cover Demonstration:</label>
              {cover && <img id='coverImg' className="d-flex justify-content-center" src={preview} /> }
            </div>
          </div>
          <div className='d-flex flex-row-reverse' ><button type="submit" className="btn btn-primary">Add Game To Catalog</button></div>
          

        </form>
      </div>
        </div>
      ) : (
        <div>
          <h1>Acess Denied</h1>
        </div>
      )}
    </div>
  );
};
  
  export default AddGameForm;