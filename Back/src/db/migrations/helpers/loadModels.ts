import { Model } from '../../../models';

const fs = require('fs');

const loadModel = async (modelName: string) => {
	const modelFile = await import(`../../../models/${modelName}/${modelName}`);

	// capitalize first letter as filename may start with lower case
	const name = modelName.charAt(0).toUpperCase() + modelName.substring(1);

	return new modelFile[name]({}) as Model;
};

const loadAllModels: () => Promise<Model[]> = async () => {
	const models: Model[] = [];
	try {
		const basePath = './src/models';
        const fileNames: string[] = await fs.promises.readdir(basePath);

		const modelNames = fileNames.filter(name => name.endsWith('AR'))
		
        for (const modelName of modelNames) {
			const model = await loadModel(modelName);
			models.push(model);
        }
    }
    catch (error) {
		throw(error); // we still want to stop execution
    }

	return models;
}

export {
	loadAllModels,
	loadModel,
}
