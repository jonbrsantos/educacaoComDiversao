from flask import Flask, render_template, redirect, request, flash, session
import json
import ast

app = Flask(__name__)

# Em produção, o ideal é usar variável de ambiente para a SECRET_KEY
app.config['SECRET_KEY'] = 'senha_admin'  # depois no Render a gente muda

# Função auxiliar para carregar usuários
def ler_usuarios():
    with open('usuarios.json') as usuariosTemp:
        return json.load(usuariosTemp)

@app.route('/')
def home():
    session['logado'] = False
    return render_template('login.html')

@app.route('/admin')
def admin():
    if session.get('logado'):
        usuarios = ler_usuarios()
        return render_template("administrador.html", usuarios=usuarios)
    else:
        return redirect('/')

@app.route('/selectgame', methods=['POST', 'GET'])
def selectgame():
    return render_template('select_game.html')

@app.route('/login', methods=['POST', 'GET'])
def login():
    session['logado'] = False
    session['aluno'] = ""

    nome = request.form.get('nome')
    senha = request.form.get('senha')

    if nome == 'admin' and senha == 'admin':
        session['logado'] = True
        return redirect('/admin')

    usuarios = ler_usuarios()
    for usuario in usuarios:
        if usuario['nome'] == nome and usuario['senha'] == senha:
            session['aluno'] = usuario['nome']
            return render_template('select_game.html',aluno=session['aluno'])

    flash('Usuário inválido')
    return redirect('/')

@app.route('/cadastrarUsuario', methods=['POST', 'GET'])
def cadastrarUsuario():
    nome = request.form.get('nome')
    senha = request.form.get('senha')
    user = [
        {
            "usuario": nome,
            "nome": nome,
            "senha": senha
        }
    ]

    usuarios = ler_usuarios()
    usuarios += user

    with open('usuarios.json', 'w') as gravarTemp:
        json.dump(usuarios, gravarTemp, indent=4)

    return redirect('/admin')

@app.route('/excluirUsuario', methods=['POST'])
def excluirUsuario():
    session['logado'] = True
    usuario = request.form.get('usuarioPexcluir')
    usuarioDict = ast.literal_eval(usuario)
    nome = usuarioDict['nome']

    usuariosJson = ler_usuarios()
    if usuarioDict in usuariosJson:
        usuariosJson.remove(usuarioDict)

        with open('usuarios.json', 'w') as usuarioAexcluir:
            json.dump(usuariosJson, usuarioAexcluir, indent=4)

    flash(f'{nome} EXCLUÍDO')
    return redirect('/admin')

@app.route('/alfabeto', methods=['GET'])
def alfabeto():
    return render_template('alfabeto.html')

@app.route('/rimas', methods=['GET'])
def rimas():
    return render_template('rimas.html')

@app.route('/memoria', methods=['GET'])
def memoria():
    return render_template('memoria.html')

@app.route('/galinhas', methods=['GET'])
def galinhas():
    return render_template('galinhas.html')

@app.route('/sair')
def sair():
    session.clear()
    return redirect('/')

if __name__ == "__main__":
    app.run(debug=True)