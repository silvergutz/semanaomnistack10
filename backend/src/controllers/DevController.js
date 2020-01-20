const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');

module.exports = {
    async index(req, resp) {
        const devs = await Dev.find();

        resp.json(devs);
    },

    async show(req, resp) {
        const { id } = req.params;

        const dev = await Dev.findById(id);
        const status = dev ? 200 : 404;

        resp.status(status);
        resp.json({ dev });
    },

    async store(req, resp) {
        const { github_username, techs, latitude, longitude } = req.body;
        
        let status = 500;
        let error = null;
        let dev = await Dev.findOne({ github_username });

        if (dev) {
            status = 303;
        } else {
            await axios.get(`https://api.github.com/users/${github_username}`)
                .then(async apiResponse => {

                    console.log(apiResponse);
        
                    const { name = login, avatar_url, bio } = apiResponse.data;
                
                    const techsArray = parseStringAsArray(techs);
                
                    const location = {
                        type: 'Point',
                        coordinates: [longitude, latitude],
                    };
                
                    dev = await Dev.create({
                        github_username,
                        name,
                        avatar_url,
                        bio,
                        techs: techsArray,
                        location,
                    }).catch(err => {
                        error = err;
                        status = 500;
                    });
        
                    status = dev._id ? 201 : 500;
                })
                .catch(err => {
                    console.log(err);
                    if (err.message.indexOf(404) > -1) {
                        error = 'Usuário não encontrado no GitHub';
                        status = 400;
                    } else {
                        error = err;
                        status = 500;
                    }
                })
            ;
        }
    
        const result = {
            resource: dev,
            success: status == 201,
            error,
        };

        resp.status(status);
        resp.json(result);
    },

    async update(req, resp) {
        const { name = undefined, avatar_url = undefined, bio = undefined, techs = undefined, latitude = undefined, longitude = undefined } = req.body;
        const { id } = req.params

        const techsArray = parseStringAsArray(techs);
        
        const data = {
            name,
            avatar_url,
            bio,
        };

        if (latitude && longitude) {
            data.location = {
                type: 'Point',
                coordinates: [longitude, latitude],
            };
        }

        if (techs) {
            data.techs = techsArray;
        }

        const dev = await Dev.update({ _id: id }, data);

        resp.json({ dev })
    },

    async destroy(req, resp) {
        const { id } = req.params;

        const result = await Dev.deleteOne({ _id: id });

        resp.json({ result });
    },
};