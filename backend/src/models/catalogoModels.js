import { ObjectId } from "mongodb";
import conectarAoBanco from '../config/database.js';
import crypto from 'crypto';
import 'dotenv/config';

globalThis.crypto = crypto;
const conexao = await conectarAoBanco(
    process.env.STRING_CONEXAO
);