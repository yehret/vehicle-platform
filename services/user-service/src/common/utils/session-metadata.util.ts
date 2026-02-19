import type { Request } from 'express';
import { lookup } from 'geoip-lite';
import * as countries from 'i18n-iso-countries';

import type { SessionMetadata } from '../types/session-metadata.types';

// @typescript-eslint/no-require-imports
import DeviceDetector = require('device-detector-js');

// @typescript-eslint/no-require-imports
countries.registerLocale(require('i18n-iso-countries/langs/en.json'));

const IS_DEV_ENV = process.env.NODE_ENV === 'development';

export function getSessionMetadata(req: Request, userAgent: string): SessionMetadata {
	const ip = IS_DEV_ENV
		? '37.30.20.153'
		: Array.isArray(req.headers['cf-connecting-ip'])
			? req.headers['cf-connecting-ip'][0]
			: req.headers['cf-connecting-ip'] ||
				(typeof req.headers['x-forwarded-for'] === 'string'
					? req.headers['x-forwarded-for'].split(',')[0]
					: req.ip);

	const location = lookup(ip);
	const device = new DeviceDetector().parse(userAgent);

	return {
		location: {
			country: location?.country ? countries.getName(location.country, 'en') || 'Unknown' : 'Local/Unknown',
			city: location?.city || 'Unknown',
			latitude: location?.ll?.[0] || 0,
			longitude: location?.ll?.[1] || 0
		},
		device: {
			browser: device.client?.name || 'Unknown',
			os: device.os?.name || 'Unknown',
			type: device.device?.type || 'Desktop'
		},
		ip
	};
}
