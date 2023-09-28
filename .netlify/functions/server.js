const axios = require('axios');
const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const geolib = require('geolib');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();

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

const sequelize = new Sequelize('postgres://postgres:julius23!@localhost:5432/postgres');

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
);

MainData.beforeCreate(async (data) => {
  // Hash the password before saving the user
  const hashedPassword = await bcrypt.hash(data.password, 10);
  data.password = hashedPassword;
});

app.use(express.json());

// Retrieve data endpoint
app.get('/data', async (req, res) => {
  try {
    const { filterTerm, checkboxOptions, city, state, country, maxDistance = 25 } = req.query;

    // Geocode the city, state, country to get user coordinates
    const userCoordinates = await geocodeCity(city, state, country);
    if (!userCoordinates) {
      return res.status(400).json({ error: 'Invalid location' });
    }

    // Construct the query based on the filter parameters
    const filterConditions = {};

    if (filterTerm) {
      filterConditions.conditions = {
        [Sequelize.Op.iLike]: `%${filterTerm}%`
      };
    }

    if (checkboxOptions && checkboxOptions.length > 0) {
      filterConditions.treatments = {
        [Sequelize.Op.iLike]: checkboxOptions.map((option) => `%${option.toLowerCase()}%`)
      };
    }

    // Retrieve all data matching the filter conditions
    const rows = await MainData.findAll({
      attributes: ['id', 'conditions', 'treatments', 'latitude', 'longitude', 'name', 'address', 'email', 'phone', 'city', 'state', 'country'],
      where: filterConditions
    });

    // Filter results based on distance
    const filteredResults = rows.filter((data) => {
      const targetLatitude = parseFloat(data.latitude);
      const targetLongitude = parseFloat(data.longitude);
      const distanceInMiles = geolib.convertDistance(
        geolib.getDistance(userCoordinates, { latitude: targetLatitude, longitude: targetLongitude }),
        'mi'
      );
      return distanceInMiles <= parseFloat(maxDistance);
    });

    if (filteredResults.length === 0) {
      return res.status(404).json({ error: 'No results found within the specified radius' });
    }

    res.json(filteredResults);
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Retrieve profile by ID endpoint
app.get('/api/profiles/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const profile = await MainData.findByPk(id, {
      attributes: ['name', 'description', 'conditions', 'treatments', 'website', 'address', 'email', 'phone', 'id']
    });

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json(profile);
  } catch (error) {
    console.error('Error retrieving profile:', error);
    res.status(500).json({ error: 'Failed to retrieve profile' });
  }
});

// Update profile endpoint
app.put('/api/profiles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { field, value } = req.body;

    const profile = await MainData.findByPk(id);

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    profile[field] = value;
    await profile.save();

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// User login endpoint
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const user = await MainData.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, 'your-secret-key');

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

    res.json(userData);
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Insert data endpoint
app.post('/data', async (req, res) => {
  try {
    const { clinicName, description, conditions, address, country, city, state, phone, email, password } = req.body;

    const id = Math.floor(Math.random() * 9000000) + 1000000;

    const userCoordinates = await geocodeCity(city, state, country);
    if (!userCoordinates) {
      return res.status(400).json({ error: 'Invalid location' });
    }

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
    });

    res.status(200).json({ message: 'Data inserted successfully' });
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ error: 'Failed to insert data' });
  }
});

exports.handler = async (event, context) => {
  try {
    await app(event, context);
  } catch (error) {
    console.error('Error executing request:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' })
    };
  }
};
