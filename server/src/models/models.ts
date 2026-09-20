import { User } from "./userModel";
import { Auth } from "./authModel";
import { Report } from "./reportModel";
import { Pet } from "./petModel";

User.hasOne(Auth, {
    onDelete:"CASCADE"
});
Auth.belongsTo(User);

User.hasMany(Pet, {
    onDelete:"CASCADE"
});
Pet.belongsTo(User);

Pet.hasMany(Report);
Report.belongsTo(Pet);

User.hasMany(Report, {
    onDelete:"CASCADE"
});
Report.belongsTo(User);

export {User, Auth, Pet, Report};