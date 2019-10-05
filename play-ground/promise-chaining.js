 require('../src/db/mongoose.js');
 var User = require('../src/models/user.js');

const updateAgeAndCount = async function(id, age) {
    const user = await User.findByIdAndUpdate(id, { age })
    console.log("user ",user);
    const count = await User.countDocuments({ age })
    return count
}

updateAgeAndCount('5d22c7fe7d77d90e10ebc5c5', 3).then((count) => {
    console.log(count)
}).catch((e) => {
    console.log(e)
})

