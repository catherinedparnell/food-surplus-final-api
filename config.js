var config = {
sunapee: {
	database: {
		host     : 'sunapee.cs.dartmouth.edu',
		user     : 'FoodSurplus_sp20', //'your sunapee username here'
		password : 'TtpV=6SH', //'your sunapee password here'
		schema : 'FoodSurplus_sp20' //'your sunapee default schema'
	},
	port: 3000
},
local: {
	database: {
		host     : 'localhost',
		user     : 'root', //'your localhost username here'
		password : 'easypasswordlab3', //your localhost password here'
		schema : 'FoodSurplus_sp20' //'your localhost default schema here'
	},
	port: 3000
}
};
module.exports = config;
