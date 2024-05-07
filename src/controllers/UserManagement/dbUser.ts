import express, { Express, Request, Response } from 'express';
import User from '../../schema/userSchema/user'; // Assuming User is a Mongoose model
import dbUser from '../../schema/userSchema/dbUser'; // Assuming dbUser is a Mongoose model
import { exec } from 'child_process';

const app = express();

// Body parser middleware for JSON data
app.use(express.json());

export const adddbUser = async (req: Request, res: Response) => {
  const { empID, username, password, roles, database, host } = req.body;
  try {
    

    if (!empID || !username || !password || !roles?.role|| !roles?.database || !roles?.host) {
      return res.status(400).send('Invalid request body');
    } 
    else {
      const empid = await User.findOne({ empID }); // Type assertion for User model
      if (!empid) {
        res.send('Employee is not registered. Please register the user first');
      } else {
        const eid = await dbUser.findOne({empID})
        const db = await dbUser.findOne({database})
        const permission = await dbUser.findOne({roles})
        if (eid && db && permission) {
          res.send(`User with empid ${empID} is already added to the ${roles?.database} database with following role ${roles?.role}`)
        } else {
          const newDbUser = new dbUser(
            { 
              empID, 
              username, 
              password, 
              roles
            });
          await newDbUser.save();

          const shellScriptPath = '/home/prem/Desktop/vscode/express-metrics/dev/src/controllers/UserManagement/scripts/dbUser.sh';

          // Use Promise to handle asynchronous script execution
          const scriptResult = await new Promise<string>((resolve, reject) => {
            exec(
              `sh ${shellScriptPath} ${roles?.host} ${roles?.database} ${username} ${password} ${roles?.role}`,
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
    res.status(500).send(`You are trying to update existing record for ${username} with empid ${empID}. Please go to the Update User page.`);
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { empID, username, password, roles } = req.body;

  try {
    if (!empID || !roles?.role || !roles?.database || !roles?.host) {
      return res.status(400).send('Invalid request body');
    }

    const existingUser = await dbUser.findOne({ empID });
    if (!existingUser) {
      return res.status(404).send('User with empID not found.');
    }

    // Update username and password if provided
    if (username) {
      existingUser.username = username;
    }
    if (password) {
      existingUser.password = password;
    }

    // Update roles by combining existing and new values
    existingUser.roles = {
      ...existingUser.roles, // Preserve existing role data
      ...roles, // Add new role properties (role, database, host)
    };

    await existingUser.save();

    res.status(200).send('User updated successfully.');
  } catch (err) {
    res.status(500).send('Error updating user:', err);
  }
};


export default {
  adddbUser,
};