

describe('Service: Tasks', () => {

    const Users = app.db.models.Users;
    const Tasks = app.db.models.Tasks;

    let userRequest = {
        name: 'Tony Stark',
        email: 'tony@stark.com',
        password: '717273'
    }

    let tasks;

    before(done => {
        // ORM => Object Relational Mapping
        Users
            .destroy({ where: { email: userRequest.email } })
            .then(() =>
                Users.create(userRequest)
            )
            .then(user => {
                tasks = [
                    {
                        title: 'Criar a Mark1',
                        user_id: user.id
                    },
                    {
                        title: 'Criar a Mark2',
                        user_id: user.id
                    },
                    {
                        title: 'Atualizar o Jarvis',
                        user_id: user.id
                    }
                ]
                Tasks.bulkCreate(tasks);
                done();
            });
    });



    describe('GET /tasks', () => {

        let token;

        before((done) => {
            request
                .post('/token')
                .send({
                    email: userRequest.email,
                    password: userRequest.password
                })
                .end((err, res) => {
                    token = res.body.token;
                    done(err);
                })
        })

        it('retorna uma lista de tarefas', (done) => {
            request
                .get('/tasks')
                .set('Authorization', `JWT ${token}`)
                .end((err, res) => {
                    expect(res.statusCode).to.eql(200);
                    expect(res.body).to.be.an('array');

                    for (let i = 0, size = res.body.length; i < size; i++) {
                        expect(res.body[i].title).to.eql(tasks[i].title);
                        expect(res.body[i].user_id).to.eql(tasks[i].user_id);
                        expect(res.body[i].done).to.eql(false);
                    }

                    done(err);
                });
        });

    })


    describe('GET /tasks/:id', () => {

        let token;
        let tasksResponse;

        before((done) => {
            request
                .post('/token')
                .send({
                    email: userRequest.email,
                    password: userRequest.password
                })
                .end(function (err, res) {
                    token = res.body.token;
                    request
                        .get(`/tasks`)
                        .set('Authorization', `JWT ${token}`)
                        .end(function (err, res) {
                            tasksResponse = res.body;
                            done(err);
                        });
                });

        })
        // before((done) => {

        // Obter uma lista de tarefas
        // Dessa lista extrair um item
        // Este item deve ser usado para o cenário Obter uma única tarefa


        // });

        it('obter uma única tarefa', (done) => {
            request
                .get(`/tasks/${tasksResponse[0].id}`)
                .set('Authorization', `JWT ${token}`)
                .end((err, res) => {
                    expect(res.statusCode).to.eql(200)
                    done(err);
                });
        });

        it('tarefa não encontrada', (done) => {
            request
                .get('/tasks/0')
                .set('Authorization', `JWT ${token}`)
                .end((err, res) => {
                    expect(res.statusCode).to.eql(404);
                    done(err);
                });
        })


    })



});
