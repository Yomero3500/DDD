import { IUsuarioRepository } from '../../domain/repositories/usuario-repository';
import { Usuario } from '../../domain/entities/user';
import { Perfil } from '../../domain/value-objects/perfil';
import { Rol, TipoRol } from '../../domain/value-objects/rol';
import { Email } from '../../domain/value-objects/email';
import { Password } from '../../domain/value-objects/password';
import mongoose, { Schema, Document } from 'mongoose';

interface IUsuarioDocument extends Document {
  nombre: string;
  email: string;
  contrasena: string;
  perfil: {
    idioma: string;
    zonaHoraria: string;
  };
  rol: string;
}

const UsuarioSchema = new Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  contrasena: { type: String, required: true },
  perfil: {
    idioma: { type: String, required: true },
    zonaHoraria: { type: String, required: true }
  },
  rol: { type: String, required: true }
});

const UsuarioModel = mongoose.model<IUsuarioDocument>('Usuario', UsuarioSchema);

export class MongoUsuarioRepository implements IUsuarioRepository {
  async save(usuario: Usuario): Promise<void> {
    const usuarioDoc = new UsuarioModel({
      nombre: usuario.getNombre(),
      email: usuario.getEmail(),
      contrasena: usuario.getPassword(),
      perfil: {
        idioma: usuario.getPerfil().getIdioma(),
        zonaHoraria: usuario.getPerfil().getZonaHoraria()
      },
      rol: usuario.getRol().getTipo()
    });
    await usuarioDoc.save();
  }

  async findById(id: string): Promise<Usuario | null> {
    const usuarioDoc = await UsuarioModel.findById(id);
    if (!usuarioDoc) {
      return null;
    }
    return this.toEntity(usuarioDoc);
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    const usuarioDoc = await UsuarioModel.findOne({ email });
    if (!usuarioDoc) {
      return null;
    }
    return this.toEntity(usuarioDoc);
  }
  async update(usuario: Usuario): Promise<void> {
    const updateData: any = {
      nombre: usuario.getNombre(),
      email: usuario.getEmail(),
      perfil: {
        idioma: usuario.getPerfil().getIdioma(),
        zonaHoraria: usuario.getPerfil().getZonaHoraria()
      },
      rol: usuario.getRol().getTipo()
    };

    // Solo actualizar la contraseña si ha cambiado
    if (usuario.getPassword()) {
      updateData.contrasena = usuario.getPassword();
    }

    await UsuarioModel.updateOne(
      { _id: usuario.getId() },
      updateData
    );
  }

  async delete(id: string): Promise<void> {
    await UsuarioModel.deleteOne({ _id: id });
  }

  private toEntity(doc: IUsuarioDocument): Usuario {
    return new Usuario(
      doc._id.toString(),
      doc.nombre,
      new Email(doc.email),
      Password.fromHash(doc.contrasena), // CORRECTO: reconstruir desde el hash
      new Perfil(doc.perfil.idioma, doc.perfil.zonaHoraria),
      new Rol(doc.rol as TipoRol)
    );
  }
}
