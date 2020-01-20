const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');

module.exports = {
    async index(req, resp) {
        const { latitude, longitude, raio = 10000, techs } = req.query;

        let techsArray = parseStringAsArray(techs);
        techsArray = techsArray.map(tech => new RegExp(tech, 'i'));
        
        const devs = await Dev.find({
            techs: {
                $in: techsArray,
            },
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [longitude, latitude],
                    },
                    $maxDistance: raio,
                },
            },
        });

        resp.json({ devs });
    }
}