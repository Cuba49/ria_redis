const
    config = require('config')
;
var redis = require("redis");
var client = redis.createClient();

client.on("connect", function() {
  console.log("You are now connected");
});
// Десь тут можна вказати параметри конекшина до redis-а
// config.redis.port


module.exports = {
    /**
     * Get all records from memory DB
     * @return {Promise}
     */
    getAll: async function getAllFromDb() {
        return new Promise((resolve, reject) => {
            client.get('users', function(err, reply) {
                let users= reply?JSON.parse(reply):[];
                resolve(users);
            });
        });
    },
    /**
     * Get record by id from memory DB
     * @param id
     * @return {Promise}
     */
    getById: function getIdFromDb(id) {
        return new Promise((resolve, reject) => {
            client.get('users', function(err, reply) {
                let users= reply?JSON.parse(reply):[];
                let user=users.find(x => x.id == id)||{};
                resolve(user);
            });
        });
    },
    /**
     * Add new record to memory DB
     * @param name
     * @return {Promise}
     */
    setNewId: function setNewIdToDb(name) {
        return new Promise((resolve, reject) => {
            client.get('users', function(err, reply) {
                let users= reply?JSON.parse(reply):[];
                users.push({id:users.length, name:name})
                client.set("users", JSON.stringify(users), function(err, reply) {
                    resolve(module.exports.getById(users.length));
                });
            });
        });
    },
    /**
     * Update record into memory DB
     * @param id
     * @param name
     * @return {Promise}
     */
    updateId: function updateIdToDb(id,name) {
        return new Promise((resolve, reject) => {
            client.get('users', function(err, reply) {
                let users= reply?JSON.parse(reply):[];
                let user=users.find(x => x.id == id)||{};
                user.name=name;
                client.set("users", JSON.stringify(users), function(err, reply) {
                    resolve(module.exports.getById(id));
                });
            });
        });
    },

    /**
     * Remove record from memory DB
     * @param id
     * @return {Promise}
     */
    removeId: function removeIdInDb(id) {
        return new Promise((resolve, reject) => {
            client.get('users', function(err, reply) {
                let users= reply?JSON.parse(reply):[];
                users = users.filter(x=>x.id!=id);
                client.set("users", JSON.stringify(users), function(err, reply) {
                    resolve(module.exports.getById(users.length));
                });
            });
        });
    }
}