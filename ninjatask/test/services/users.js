


describe('Services: Users', () => {
    const Users = app.db.models.Users;

    describe('POST /user', () => {

        describe('status 200', () => {

            let userRequest = {
                name: 'Fernando',
                email: 'fernando@qaninja.io',
                password: '191817'
            }

            before(done => {
                // ORM => Object Relational Mapping
                Users.destroy({ where: { email: userRequest.email } })
                done();
            });

            it('cadastro de novo usuário', (done) => {
                request
                    .post('/users')
                    .send(userRequest)
                    .end((err, res) => {
                        expect(res.statusCode).to.eql(200);
                        expect(res.body.name).to.eql('Fernando');
                        expect(res.body.email).to.eql('fernando@qaninja.io');
                        done(err);
                    });
            });
        });

        describe('status 409', () => {

            let userRequest = {
                name: 'Fernando',
                email: 'eu@papito.io',
                password: '191817'
            }

            before(done => {
                // ORM => Object Relational Mapping
                Users
                    .destroy({ where: { email: userRequest.email } })
                    .then(() => {
                        Users.create(userRequest);
                        done();
                    });
            });

            it('usuário duplicado', (done) => {
                request
                    .post('/users')
                    .send(userRequest)
                    .end((err, res) => {
                        expect(res.statusCode).to.eql(409);
                        expect(res.body.msg).to.eql('Oops. Looks like you already have an account with this email address.');
                        done(err);
                    });
            });


        })

    });

});