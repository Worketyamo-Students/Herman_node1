// src/core/config/env.ts

import 'dotenv/config';
import { get } from 'env-var';

export const envs = {
	PORT: get('PORT').required().asPortNumber(),
	API_PREFIX: get('DEFAULT_API_PREFIX').default('/api/v1').asString(),
	NODE_ENV: get('NODE_ENV').default('development').asString(),
	MONGO_INITDB_ROOT_USERNAME: get('MONGO_INITDB_ROOT_USERNAME').default('admin').asString(),
	MONGO_INITDB_ROOT_PASSWORD: get('MONGO_INITDB_ROOT_PASSWORD').default('test123').asString(),
	MONGO_DB_NAME: get('MONGO_DB_NAME').default('worketyamo').asString(),
	mot_de_passe: "ybfm tkhc pyaa bmuy",
	address_mail: "cesaristos85@gmail.com",
	token_key: "AAAAB3NzaC1yc2EAAAADAQABAAABgQCVLsO/6uRXgtyddPkGh+X58OyVFoo0zOyzXCLfOBy/Oyw76pmit6hDvy/Cn2+d8HgEOiBB+/fYWucSLfvzSTQyoLEs2uBdjDEjwEfezd/vKQXHsAV28nHRok8IdVFYmmEUK7S/zeaBdzQR4e1Zw2qGotTgiJ8cbi8f3NDI18QFk813cUId51sxoQU3goBAgaBRt7UjaZXVDJ+lt1fYdXsM8MAoGGJagsCtGdm/nKCJe8iBPoaZDPqvxijcsehRNk09PBibpXvscfa2bN7391MgfJyb65tZWEnTpDaB0LLQR505xd1X8nEUqgU7pXhl2GAIu4eEMMs2s469+I7YLCk9wsd1N6WvPOHaQq73ETaK7Np79oYeAJ+uMhifRfgLj1iSdi7WPXrxnF+OOruSgm0LGdXlm4pPScSTgm8LGFK2Z2bnvIOjmeJ2fMZOV0FOXGzdDdfXrw862a3CmBfKsHR/xEzrSs82z17jZ9NpBe/Zr9AhPxk6s3nZOoy8hwqoFn0= Hp@DESKTOP-QL6VDQ9",
	refresh_token: " AAAAB3NzaC1yc2EAAAADAQABAAABgQC/yTqKcKjMfHyCw7d3sApeuMdNsYvoN6YkdZByxlhWje3wAFzRZJj3fY/hI+Qh0Sqb9c70+CGvGAsST/MGRSRjTW5p3jjxPc2B7cWhMhesz7W8QxSM6UkkjvLlqfrf/8KYfZa1CHeVgqDekW5t9bSYSuT1qxuGX0qzqBo2qYkocCXVk0dkBwEe4xFZvkY/tdJo907+yWGn6JU5TLNZhLn3enw/zIV5uCxhRmJG82sT/xJRDsTPEpEZY/oCsOg4J6+wBkpm3cPObma5NNF21YEyV5nNuOm6nPmpt0oh8V3ARvJoOQbbwZ/pJUeMtM6lGqQLXm14drJHIAxnai6WfeK7BanHpvYQL+/XhwKdqdelag7BVuO0xfyLxPr7/58cXhwS8MGa4KKMzNhxoc9aIbXanXQ8zX3QqSCiwi/lYDPoSA+4RzaI9hnth2c+rHCfxSFW+4yedXSoU6JSYOE2ta8QfFuGKn4eJPyPXnfFAIvyXd0No2BK/TD/dal7QcrCRJE= Hp@DESKTOP-QL6VDQ9"
};

export const CONNECTION_STRING = `mongodb://${envs.MONGO_INITDB_ROOT_USERNAME}:${envs.MONGO_INITDB_ROOT_PASSWORD}@172.28.0.2:27017/${envs.MONGO_DB_NAME}?authSource=admin`;
