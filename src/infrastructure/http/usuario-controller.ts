import express, { Request, Response } from 'express';
import { UsuarioService } from '../../application/services/usuario-service';
import { CreateUserDTO } from '../../application/dtos/user-dto';

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
