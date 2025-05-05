from flask import Flask, render_template, redirect, request, flash, session
from config import Config
from models import db, Usuario, seed_usuarios

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)

# Cria as tabelas e popula dados iniciais
with app.app_context():
    db.create_all()
    seed_usuarios()

# ========== Rotas principais ==========
@app.route('/')
def home():
    session.clear()
    return render_template('login.html')


@app.route('/login', methods=['POST', 'GET'])
def login():
    session.clear()
    email = request.form.get('usuario')
    senha = request.form.get('password')

    usuario = Usuario.query.filter_by(email=email, senha=senha).first()

    if usuario:
        session['logado'] = True if usuario.tipo == 'admin' else False
        session['aluno'] = usuario.nome if usuario.tipo != 'admin' else None
        return redirect('/admin') if usuario.tipo == 'admin' else render_template('select_game.html', aluno=usuario.nome)

    flash('Usuário inválido')
    return redirect('/')


@app.route('/sair')
def sair():
    session.clear()
    return redirect('/')

# ========== Área administrativa ==========
@app.route('/admin')
def admin():
    if session.get('logado'):
        usuarios = Usuario.query.all()
        return render_template('administrador.html', usuarios=usuarios)
    return redirect('/')


# ========== CRUD de Usuários ==========
@app.route('/cadastro', methods=['GET'])
def cadastro():
    return render_template('cadastrar_usuario.html')


@app.route('/cadastrarUsuario', methods=['POST', 'GET'])
def cadastrarUsuario():
    if request.method == 'POST':
        nome = request.form.get('nome')
        email = request.form.get('email')
        senha = request.form.get('senha')
        tipo = request.form.get('tipo')  # 'admin' ou 'usuario'

        try:
            novo_usuario = Usuario(nome=nome, email=email, senha=senha, tipo=tipo)
            db.session.add(novo_usuario)
            db.session.commit()
            flash(f'Usuário {nome} cadastrado com sucesso!')
        except Exception as e:
            db.session.rollback()
            flash(f'Erro ao cadastrar usuário: {str(e)}')
        return redirect('/admin')

    return render_template('cadastro_usuario.html')



@app.route('/editarUsuario/<int:id>', methods=['GET', 'POST'])
def editar_usuario(id):
    usuario = Usuario.query.get_or_404(id)

    if request.method == 'POST':
        usuario.nome = request.form.get('nome')
        usuario.email = request.form.get('email')
        usuario.senha = request.form.get('senha')
        usuario.tipo = request.form.get('tipo')
        db.session.commit()
        flash(f'Usuário {usuario.nome} atualizado com sucesso!')
        return redirect('/admin')

    return render_template('editar_usuario.html', usuario=usuario)


@app.route('/excluirUsuario', methods=['POST'])
def excluir_usuario():
    if session.get('logado'):
        usuario_id = request.form.get('usuario_id')
        usuario = Usuario.query.get(usuario_id)
        if usuario:
            db.session.delete(usuario)
            db.session.commit()
            flash(f'{usuario.nome} EXCLUÍDO com sucesso!')
        return redirect('/admin')
    return redirect('/')


# ========== Telas dos jogos / atividades ==========
@app.route('/selectgame')
def select_game():
    return render_template('select_game.html')

@app.route('/alfabeto')
def alfabeto():
    return render_template('alfabeto.html')

@app.route('/rimas')
def rimas():
    return render_template('rimas.html')

@app.route('/memoria')
def memoria():
    return render_template('memoria.html')

@app.route('/galinhas')
def galinhas():
    return render_template('galinhas.html')

@app.route('/calendario')
def calendario():
    return render_template('calendario.html')

@app.route('/quadro')
def quadro():
    return render_template('quadro.html')

@app.route('/preenchaalfabeto')
def preencha_alfabeto():
    return render_template('preenchaalfabeto.html')


# ========== Execução ==========
if __name__ == "__main__":
    app.run(debug=True)
