// lib/syncUser.js
import { User } from '@auth0/nextjs-auth0/types';
import { prisma } from './prisma';

/**
 * Busca o crea un usuario en la base de datos a partir de los datos de Auth0.
 * @param {object} auth0User - El objeto de usuario devuelto por Auth0.
 * @returns {Promise<object>} El objeto de usuario de la base de datos.
 */
export async function syncUser(auth0User: User) {
  const { sub, email, name } = auth0User;

  try {
    const user = await prisma.user.upsert({
      where: { auth0Id: sub }, // Busca el usuario por el 'sub' de Auth0
      update: { 
        // Actualiza el email y/o nombre si cambiaron
        email : email,
        name  : name,
      },
      create: { 
        // Crea el nuevo usuario si no existe
        auth0Id : sub,
        email   : email,
        name    : name,
      },
    });
    return user;
  } catch (error) {
    // Maneja el error según sea necesario
    throw new Error('Database sync failed');
  }
}