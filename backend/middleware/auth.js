// Este middleware verifica se o usuário está logado antes de
// permitir acesso às rotas protegidas do sistema.

// "Middleware" = função que fica no meio do caminho entre a requisição HTTP e a resposta
// Recebe os objetos de requisição (req), resposta (res) e a função next.
// Decide se deixa a requisição prosseguir (next()) ou se a bloqueia (res.status(401)).

function requireAuth(req, res, next) {
  // req.session.userId é definido no controlador de autenticação ao fazer login.
  // Se não existir ou a sessão for inválida, o usuário não está autenticado.
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ erro: 'Não autenticado. Faça login primeiro.' })
    // HTTP 401 Unauthorized: Indica que a autenticação é necessária.
  }

  // Se o userId existe na sessão, o usuário está devidamente logado.
  // next() faz o Express passar a requisição para a próxima função/rota na fila.
  next()
}

module.exports = { requireAuth }
