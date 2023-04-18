const { Validator } = require('node-input-validator');
const helper = require('../../helpers/helper');
const response = require('../../helpers/response');
const query = require('../../helpers/query');
const models = require('../../models/index')
const modelName ='Users';

module.exports = {
    list: async (req, res) => {
        try {
           let get_all_data = await query.find_all(modelName);

			if(get_all_data){
				return response.success(res, "All List.", get_all_data);
			} else {
				return response.failed(res, "Invalid Data")
			}
        } catch (error) {
            return response.failed(res, error)
        }
    },
}