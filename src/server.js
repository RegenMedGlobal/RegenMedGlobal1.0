const axios = require('axios');
const express = require('express')
const { Sequelize, DataTypes } = require('sequelize')
const { GOOGLE_MAPS_API_KEY } = require('./config.js')
const geolib = require('geolib')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// Create an instance of Express
const app = express()

const geocodeCity = async (city, state, country) => {
  try {
    const address = `${city}, ${state}, ${country}`;
    const encodedAddress = encodeURIComponent(address);
		const apiKey = 'AIzaSyBsY7TWsifdD_oYfwhEKBqVdLzfBaSeu6A'

    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`
    );

    const results = response.data.results;
    console.log('geocode results:', results);

    if (results && results.length > 0) {
      const result = results[0];
      const { lat, lng } = result.geometry.location;
      return { latitude: lat, longitude: lng };
    } else {
      console.log('No results found for the city:', city, state, country);
      return null;
    }
  } catch (error) {
    console.log('Error geocoding:', error);
    return null;
  }
};


// Configure the PostgreSQL connection
const sequelize = new Sequelize('postgres://postgres:julius23!@localhost:5432/postgres')
// const sequelize = new Sequelize('postgres://postgres:julius23!@/postgres?unix_socket=/cloudsql/regenmedglobal-75fda:us-central1:regenmedglobal');

// Define the model for the "maindata" table
const MainData = sequelize.define(
  'maindata',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING
    },
    description: {
      type: DataTypes.STRING
    },
    treatments: {
      type: DataTypes.STRING
    },
    conditions: {
      type: DataTypes.STRING
    },
    address: {
      type: DataTypes.STRING
    },
    country: {
      type: DataTypes.STRING
    },
    state: {
      type: DataTypes.STRING
    },
    city: {
      type: DataTypes.STRING
    },
    phone: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING
    },
    password: {
      type: DataTypes.STRING
    },
    latitude: {
      type: DataTypes.FLOAT
    },
    longitude: {
      type: DataTypes.FLOAT
    }
  },
  {
    tableName: 'maindata',
    timestamps: false
  }
)

// Hash the password before saving the user
MainData.beforeCreate(async (data) => {
  const hashedPassword = await bcrypt.hash(data.password, 10)
  data.password = hashedPassword
})

app.use(express.json()) // Add this middleware to parse the JSON request body

const allowedOrigins = ['http://localhost:3000', 'https://tourmaline-dolphin-26b1c3.netlify.app'];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // Add PUT method
  next();
});


app.get('/data', async (req, res) => {
  try {
    const { filterTerm, checkboxOptions, city, state, country, maxDistance = 25 } = req.query

    // Geocode the city, state, country to get user coordinates
    const userCoordinates = await geocodeCity(city, state, country, GOOGLE_MAPS_API_KEY)
    if (!userCoordinates) {
      return res.status(400).json({ error: 'Invalid location' })
    }

    // Construct the query based on the filter parameters
    const filterConditions = {}

    if (filterTerm) {
      filterConditions.conditions = {
        [Sequelize.Op.iLike]: `%${filterTerm}%`
      }
    }

    if (checkboxOptions && checkboxOptions.length > 0) {
      filterConditions.treatments = {
        [Sequelize.Op.iLike]: checkboxOptions.map((option) => `%${option.toLowerCase()}%`)
      }
    }

    // Retrieve all data matching the filter conditions
    const rows = await MainData.findAll({
      attributes: ['id', 'conditions', 'treatments', 'latitude', 'longitude', 'name', 'address', 'email', 'phone', 'city', 'state', 'country'], // Add all desired fields here
      where: filterConditions
    })

    // Filter results based on distance
    const filteredResults = rows.filter((data) => {
      const targetLatitude = parseFloat(data.latitude)
      const targetLongitude = parseFloat(data.longitude)
      const distanceInMiles = geolib.convertDistance(
        geolib.getDistance(userCoordinates, { latitude: targetLatitude, longitude: targetLongitude }),
        'mi'
      )
      return distanceInMiles <= parseFloat(maxDistance)
    })

    if (filteredResults.length === 0) {
      // Send a custom response indicating no results within the radius
      return res.status(404).json({ error: 'No results found within the specified radius' })
    }

    // Send the filtered query results as the response
    res.json(filteredResults)
  } catch (error) {
    console.error('Error executing query:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

// Add a new endpoint to retrieve a single profile by ID
app.get('/api/profiles/:id', async (req, res) => {
  try {
    const { id } = req.params

    // Retrieve the profile by ID
    const profile = await MainData.findByPk(id, {
      attributes: ['name', 'description', 'conditions', 'treatments', 'website', 'address', 'email', 'phone', 'id']
    })

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' })
    }

    // Return the profile data in the response
    res.json(profile)
  } catch (error) {
    console.error('Error retrieving profile:', error)
    res.status(500).json({ error: 'Failed to retrieve profile' })
  }
})

app.put('/api/profiles/:id', async (req, res) => {
  try {
    console.log('Request Body:', req.body) // Log the req.body

    const { id } = req.params
    const { field, value } = req.body

    console.log('ID:', id)
    console.log('Field:', field)
    console.log('Value:', value)

    // Find the profile by ID
    const profile = await MainData.findByPk(id)

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' })
    }

    // Update the specific field with the new value
    profile[field] = value

    console.log('Updated Profile:', profile)

    // Save the updated profile
    await profile.save()

    res.json({ message: 'Profile updated successfully' })
  } catch (error) {
    console.error('Error updating profile:', error)
    res.status(500).json({ error: 'Failed to update profile' })
  }
})

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    // Validate the email and password
    if (!email || !password) {
      return res.status(400).json({ error: 'Invalid email or password' })
    }

    // Retrieve the user from the database based on the email
    const user = await MainData.findOne({ where: { email } })

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    // Compare the provided password with the stored password hash
    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    // Generate a JSON Web Token (JWT) for authentication
    const token = jwt.sign({ userId: user.id, email: user.email }, 'your-secret-key')

    // Construct the user data to include in the response
    const userData = {
      token,
      userId: user.id,
      email: user.email,
      description: user.description,
      conditions: user.conditions,
      address: user.address,
      city: user.city,
      state: user.state,
      country: user.country,
      name: user.name,
      clinicName: user.name,
      latitude: user.latitude,
      longitude: user.longitude,
      loggedIn: true,
      firstTimeLogin: true
      // Add more properties as needed
    }

    // Return the user data in the response
    res.json(userData)
  } catch (error) {
    console.error('Error during login:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

app.post('/data', async (req, res) => {
  try {
    console.log('Request Body:', req.body)

    const { clinicName, description, conditions, address, country, city, state, phone, email, password } = req.body

    // Generate a random 7-digit number as the id
    const id = Math.floor(Math.random() * 9000000) + 1000000

    // Geocode the city, state, and country to get the latitude and longitude
    const userCoordinates = await geocodeCity(city, state, country, GOOGLE_MAPS_API_KEY)
    if (!userCoordinates) {
      return res.status(400).json({ error: 'Invalid location' })
    }

    // Insert data into the "maindata" table using Sequelize
    await MainData.create({
      id: id,
      name: clinicName,
      description: description,
      conditions: conditions,
      address: address,
      city: city,
      country: country,
      state: state,
      phone: phone,
      email: email,
      password: password,
      latitude: userCoordinates.latitude,
      longitude: userCoordinates.longitude
    })

    res.status(200).json({ message: 'Data inserted successfully' })
  } catch (error) {
    console.error('Error inserting data:', error)
    res.status(500).json({ error: 'Failed to insert data' })
  }
})

// Sync the model with the database and start the server
const port = 3000 // Replace with the desired port for your server
sequelize
  .sync()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`)
    })
  })
  .catch((error) => {
    console.error('Error syncing database:', error)
  })
