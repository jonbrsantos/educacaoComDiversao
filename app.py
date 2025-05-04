from flask import Flask, render_template, redirect, request, flash, session
from config import Config
from models import db, Usuario, seed_usuarios

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)

with app.app_context():
    db.create_all()
    seed_usuarios()

@app.route('/')
def home():
    session['logado'] = False
    return render_template('login.html')

# Cria as tabelas e popula o banco se necessário
with app.app_context():
    db.create_all()
    seed_usuarios()


@app.route('/admin')
def admin():
    if session.get('logado'):
        usuarios = Usuario.query.all()
        return render_template("administrador.html", usuarios=usuarios)
    else:
        return redirect('/')


@app.route('/selectgame', methods=['POST', 'GET'])
def selectgame():
    return render_template('select_game.html')

@app.route('/login', methods=['POST', 'GET'])
def login():
    session.clear()
    email = request.form.get('usuario')
    senha = request.form.get('password')

    usuario = Usuario.query.filter_by(email=email, senha=senha).first()

    if usuario:
        if usuario.tipo == 'admin':
            session['logado'] = True
            return redirect('/admin')
        else:
            session['aluno'] = usuario.nome
            return render_template('select_game.html', aluno=session['aluno'])

    flash('Usuário inválido')
    return redirect('/')

@app.route('/cadastro', methods=['POST', 'GET'])
def cadastro():
     session.clear()
     return render_template('cadastrar_usuario.html')

@app.route('/cadastrarUsuario', methods=['POST', 'GET'])
def cadastrarUsuario():
    if request.method == 'POST':
        nome = request.form.get('nome')
        email = request.form.get('email')
        senha = request.form.get('senha')
        tipo = request.form.get('tipo')  # 'admin' ou 'usuario'

        # Criar um novo usuário no banco
        novo_usuario = Usuario(nome=nome, email=email, senha=senha, tipo=tipo)
        db.session.add(novo_usuario)
        db.session.commit()

        flash(f'Usuário {nome} cadastrado com sucesso!')

        return redirect('/admin')

    # Se for GET, retorna o formulário de cadastro
    return render_template('cadastro_usuario.html')

@app.route('/editarUsuario/<int:id>', methods=['GET', 'POST'])
def editarUsuario(id):
    usuario = Usuario.query.get_or_404(id)

    if request.method == 'POST':
        usuario.nome = request.form.get('nome')
        usuario.email = request.form.get('email')
        usuario.senha = request.form.get('senha')
        usuario.tipo = request.form.get('tipo')

        db.session.commit()
        flash(f'Usuário {usuario.nome} atualizado com sucesso!')
        return redirect('/admin')
    
    if request.method == 'GET':
        return render_template('editar_usuario.html', usuario=usuario)

    return render_template('editar_usuario.html', usuario=usuario)


@app.route('/registrarUsuario', methods=['POST'])
def registrarUsuario():
    nome = request.form.get('nome')
    email = request.form.get('email')
    senha = request.form.get('senha')
    tipo = request.form.get('tipo')  # 'admin' ou 'usuario'

    # Criar um novo usuário no banco
    novo_usuario = Usuario(nome=nome, email=email, senha=senha, tipo=tipo)
    db.session.add(novo_usuario)
    db.session.commit()

    flash(f'Usuário {nome} cadastrado com sucesso!')

    return redirect('/')

@app.route('/excluirUsuario', methods=['POST', 'DELETE'])
def excluirUsuario():
    if session.get('logado'):
        usuario_id = request.form.get('usuario_id')

        # Buscar o usuário pelo ID e excluir
        usuario = Usuario.query.get(usuario_id)
        if usuario:
            db.session.delete(usuario)
            db.session.commit()

            flash(f'{usuario.nome} EXCLUÍDO com sucesso!')

        return redirect('/admin')
    else:
        return redirect('/')


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

@app.route('/calendario', methods=['GET'])
def calendario():
    return render_template('calendario.html')

@app.route('/quadro', methods=['GET'])
def quadro():
    return render_template('quadro.html')

@app.route('/preenchaalfabeto', methods=['GET'])
def preenchaalfabeto():
    return render_template('preenchaalfabeto.html')


@app.route('/sair')
def sair():
    session.clear()
    return redirect('/')


if __name__ == "__main__":
    app.run(debug=True)
