import { v4 as uuidv4 } from 'uuid';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';



const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const folderPath = path.join(__dirname, '../../public/img');
    console.log('folderPath', folderPath);
    callback(null, folderPath);
  },
  filename: (req, file, callback) => {
    const filename = `${Date.now()}-${file.originalname}`;
    callback(null, filename);
  },
});

export const uploader = multer({ storage });

export const getNewId = () => uuidv4();

export const hashPassword = async (password) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

export const validPassword = async (password, user) => {
  console.log(password);
  console.log(user.password);

  try {
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      //console.log('Contraseña válida');
      return true;
    } else {
      //console.log('Contraseña inválida');
      return false;
    }
  } catch (error) {
    console.error('Error al comparar contraseñas:', error);
    return false;
  }
};
