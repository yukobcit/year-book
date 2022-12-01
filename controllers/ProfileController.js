const Profile = require("../models/Profile.js");
const ProfileOps = require("../data/profileOps");
const _profileOps = new ProfileOps();
const path = require("path");
const dataPath = path.join(__dirname, "../public/");

exports.Index = async function (request, response) {
  console.log("loading profiles from controller");
let profiles = []

if(request.query.searchProfiles){
  profiles = await _profileOps.searchProfiles(request.query.searchProfiles);
}
else{
  profiles = await _profileOps.getAllProfiles();
}

  if (profiles) {
    response.render("profiles", {
      title: "Express Yourself - Profiles",
      profiles: profiles,
    });
  } else {
    response.render("profiles", {
      title: "Express Yourself - Profiles",
      profiles: [],
    });
  }
};

exports.Detail = async function (request, response) {
  const profileId = request.params.id;
  console.log(`loading single profile by id ${profileId}`);
  let profile = await _profileOps.getProfileById(profileId);
  let profiles = await _profileOps.getAllProfiles();

  console.log("Profile:" + profile)
  if (profile) {
    response.render("profile", {
      title: "Express Yourself - " + profile.name,
      profiles: profiles,
      profileId: request.params.id,
      layout: "./layouts/side-bar-layout",
    });

  } else {
    response.render("profiles", {
      title: "Express Yourself - Profiles",
      profiles: [],
    });
  }
};

// Handle profile form GET request
exports.Create = async function (request, response) {
  response.render("profile-form", {
    title: "Create Profile",
    errorMessage: "",
    profile_id: null,
    profile: {},
  });
};

// Handle profile form GET request
exports.CreateProfile = async function (request, response) {
  // instantiate a new Profile Object populated with form data
  console.log(request.body);
  let path = "";
  if(request.files != null)
  {
    path = dataPath+"/images/"+request.files.photo.name
    request.files.photo.mv(path) 
    path = "/images/"+request.files.photo.name
  }
  else{
    path = "";
  }

  let interests = (request.body.interests).split(",")  ;
  let tempProfileObj = new Profile({
    name: request.body.name,
    interests: interests,
    imagePath: path
  });
  console.log(tempProfileObj)

  let responseObj = await _profileOps.createProfile(tempProfileObj);

  if (responseObj.errorMsg == "") {
    let profiles = await _profileOps.getAllProfiles();
    console.log(responseObj.obj);
    response.render("profile", {
      title: "Express Yourself - " + responseObj.obj.name,
      profiles: profiles,
      profileId: responseObj.obj._id.valueOf(),
      imagePath: responseObj.imagePath,
      layout: "./layouts/side-bar-layout",
    });
  }

  else {
    console.log("An error occured. Item not created.");
    response.render("profile-form", {
      title: "Create Profile",
      profile: responseObj.obj,
      errorMessage: responseObj.errorMsg,
    });
  }
};

exports.DeleteProfileById = async function (request, response) {
  const profileId = request.params.id;
  console.log(`deleting single profile by id ${profileId}`);
  let deletedProfile = await _profileOps.deleteProfileById(profileId);
  let profiles = await _profileOps.getAllProfiles();

  if (deletedProfile) {
    response.render("profiles", {
      title: "Express Yourself - Profiles",
      profiles: profiles,
    });
  } else {
    response.render("profiles", {
      title: "Express Yourself - Profiles",
      profiles: profiles,
      errorMessage: "Error.  Unable to Delete",
    });
  }
};

exports.Edit = async function (request, response) {
  const profileId = request.params.id;
  let profileObj = await _profileOps.getProfileById(profileId);
  response.render("profile-form", {
    title: "Edit Profile",
    errorMessage: "",
    profile_id: profileId,
    profile: profileObj,
  });
  console.log(profileObj)
};

exports.EditProfile = async function (request, response) {
  const profileId = request.body.profile_id;
  const profileName = request.body.name;

  let path = "";
  console.log("BOOOOOOOO" + request.files.photo.value)

  if(request.files != null)
  {
    path = dataPath+"/images/"+request.files.photo.name
    request.files.photo.mv(path) 
    path = "/images/"+request.files.photo.name
  }
  else{
    path = request.files.photo.value;
  }

  let profileInterests = request.body.interests.split(",")
  let responseObj = await _profileOps.updateProfileById(profileId, profileName,profileInterests,path);

  if (responseObj.errorMsg == "") {
    let profiles = await _profileOps.getAllProfiles();
    response.render("profile", {
      title: "Express Yourself - " + responseObj.obj.name,
      profiles: profiles,
      profileId: responseObj.obj._id.valueOf(),
      layout: "./layouts/side-bar-layout",
    });
  }

  else {
    console.log("An error occured. Item not created.");
    response.render("profile-form", {
      title: "Edit Profile",
      profile: responseObj.obj,
      profileId: profileId,
      errorMessage: responseObj.errorMsg,
    });
  }
};