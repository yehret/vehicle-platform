import 'express-session';

declare module 'express-session' {
	interface SessionData {
		userId: string;
	}
}

declare module 'express' {
	interface Request {
		session: import('express-session').Session & import('express-session').SessionData;
	}
}
