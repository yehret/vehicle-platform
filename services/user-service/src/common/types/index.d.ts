import { User } from '@prisma/client';
import 'express-session';
import { SessionMetadata } from './session-metadata.types';

declare module 'express-session' {
	interface SessionData {
		userId: string;
		createdAt: Date;
		metadata: SessionMetadata;
	}
}

declare module 'express' {
	interface Request {
		session: import('express-session').Session & import('express-session').SessionData;
		user?: User;
	}
}
