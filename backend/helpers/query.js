const models = require('../models/index')

module.exports = {
    find_one:async(model,whereCondition={})=>{
        try {
            let getData = await models[model].findOne(whereCondition)
            return getData;
        } catch (err) {
            throw err;
        }
    },

    create:async(model,addField={})=>{
        try {
            let createData = await models[model].create(
                addField
            )
            return createData;
        } catch (err) {
            return err;
        }
    },

    update:async(model,whereCondition={},updateField={})=>{
        try {
            console.log(whereCondition)
            console.log(updateField)
            let updateData = await models[model].updateMany(
                whereCondition, 
                updateField
            )
            return updateData;
        } catch (err) {
            return err;
        }
    },

    find_all:async(model,whereCondition={})=>{
        try {
            let getData = await models[model].find(whereCondition)
            return getData;
        } catch (err) {
            throw err;
        }
    },
   
    destroy:async(model,whereCondition={})=>{
        try {
            let getData = await models[model].destroy(whereCondition)
            return getData;
        } catch (err) {
            throw err;
        }
    },
}