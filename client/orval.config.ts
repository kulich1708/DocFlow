import { defineConfig } from 'orval';

export default defineConfig({
	petstore: {
		input: './src/api/swagger.json',
		output: {
			target: './src/api/api-client.ts',
			client: 'axios',
			override: {
				mutator: {
					path: './src/api/axios-instance.ts',
					name: 'axiosInstance',
				},
			},
		},
	}
});