import express, { Express, Request, Response } from 'express';
import User from '../../schema/userSchema/user'; // Assuming User is a Mongoose model
import dbUser from '../../schema/userSchema/dbUser'; // Assuming dbUser is a Mongoose model
import { exec } from 'child_process';

const app = express();

// Body parser middleware for JSON data
app.use(express.json());

export const adddbUser = async (req: Request, res: Response) => {

  try {
    const { empID, username, password, role, database, host } = req.body;

    if (!empID || !username || !password || !role || !database || !host) {
      return res.status(400).send('Invalid request body');
    } 
    else {
      const empid = await User.findOne({ empID }); // Type assertion for User model
      if (!empid) {
        res.send('Employee is not registered. Please register the user first');
      } else {
        const eid = await dbUser.findOne({empID})
        const db = await dbUser.findOne({database})
        const permission = await dbUser.findOne({role})
        if (eid && db && permission) {
          res.send(`User with empid ${empID} is already added to the ${database} database with following role ${role}`)
        } else {
          const newDbUser = new dbUser({ empID, username, password, role, database, host });
          await newDbUser.save();

          const shellScriptPath = '/home/prem/Desktop/vscode/express-metrics/dev/src/controllers/UserManagement/scripts/dbUser.sh';

          // Use Promise to handle asynchronous script execution
          const scriptResult = await new Promise<string>((resolve, reject) => {
            exec(
              `sh ${shellScriptPath} ${host} ${database} ${username} ${password} ${role}`,
              (err, stdout, stderr) => {
                if (err) {
                  reject(err);
                  console.log(err)
                } else if (stderr) {
                  reject(new Error(stderr));
                } else {
                  resolve(stdout);
                }
              }
            );
          });

          console.log('Shell script output:', scriptResult);
          res.status(200).send(`User added successfully to the ${database}`);
            
          }
        
      }
    }
  } catch (err) {
    res.status(500).send(err);
  }
};

export default {
  adddbUser,
};