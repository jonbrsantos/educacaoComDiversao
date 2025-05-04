from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Usuario(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    senha = db.Column(db.String(100), nullable=False)
    tipo = db.Column(db.String(20), nullable=False)

import json
import os
from sqlalchemy.exc import IntegrityError

def seed_usuarios():
    caminho = os.path.join(os.path.dirname(__file__), 'seedUsuarios.json')

    if not os.path.exists(caminho):
        print("Arquivo seedUsuarios.json não encontrado.")
        return

    with open(caminho, 'r') as f:
        seeds = json.load(f)

    for s in seeds:
        if not Usuario.query.filter_by(email=s['email']).first():
            novo_usuario = Usuario(
                nome=s['nome'],
                email=s['email'],
                senha=s['senha'],
                tipo=s['tipo']
            )
            db.session.add(novo_usuario)

    try:
        db.session.commit()
        print("Usuários seeds inseridos.")
    except IntegrityError:
        db.session.rollback()
        print("Erro ao inserir seeds.")
