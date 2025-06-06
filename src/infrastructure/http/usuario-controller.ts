import express, { Request, Response } from 'express';
import { UsuarioService } from '../../application/services/usuario-service';
import { CreateUserDTO, UpdatePerfilDTO } from '../../application/dtos/user-dto';
import { LoginDTO } from '../../application/use-cases/login-usuario.use-case';
import { CambiarPasswordDTO } from '../../application/use-cases/cambiar-password.use-case';

export class UsuarioController {
  constructor(private usuarioService: UsuarioService) {}

  async registrarUsuario(req: Request, res: Response): Promise<void> {
    try {
      const createUserDTO: CreateUserDTO = {
        nombre: req.body.nombre,
        email: req.body.email,
        contrasena: req.body.contrasena,
        idioma: req.body.idioma,
        zonaHoraria: req.body.zonaHoraria
      };

      const usuario = await this.usuarioService.registrarUsuario(createUserDTO);
      res.status(201).json(usuario);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      res.status(400).json({ message: errorMessage });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const loginDTO: LoginDTO = {
        email: req.body.email,
        password: req.body.password
      };

      const resultado = await this.usuarioService.login(loginDTO);
      res.json(resultado);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      res.status(401).json({ message: errorMessage });
    }
  }

  async actualizarPerfil(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.id;
      const updateDTO: UpdatePerfilDTO = {
        nombre: req.body.nombre,
        idioma: req.body.idioma,
        zonaHoraria: req.body.zonaHoraria
      };

      await this.usuarioService.actualizarPerfil(userId, updateDTO);
      res.status(200).json({ message: 'Perfil actualizado exitosamente' });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      res.status(400).json({ message: errorMessage });
    }
  }

  async cambiarPassword(req: Request, res: Response): Promise<void> {
    try {
      const cambiarPasswordDTO: CambiarPasswordDTO = {
        userId: req.params.id,
        oldPassword: req.body.oldPassword,
        newPassword: req.body.newPassword
      };

      await this.usuarioService.cambiarPassword(cambiarPasswordDTO);
      res.status(200).json({ message: 'Contraseña actualizada exitosamente' });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      res.status(400).json({ message: errorMessage });
    }
  }

  async obtenerUsuario(req: Request, res: Response): Promise<void> {
    try {
      const usuario = await this.usuarioService.obtenerUsuarioPorId(req.params.id);
      if (!usuario) {
        res.status(404).json({ message: 'Usuario no encontrado' });
        return;
      }
      res.json(usuario);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      res.status(500).json({ message: errorMessage });
    }
  }
}
