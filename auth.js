import uuid from 'uuid/v4';

const USER_COOKIE = "NOVEO_USER";

function getAuth(ctx) {
	let user = ctx.cookies.get(USER_COOKIE);

	if (typeof user === 'undefined') {
		const key = uuid();
		ctx.cookies.set(USER_COOKIE, key, { httpOnly: false });
		user = key;
	}

	return user;
}

module.exports = { getAuth }