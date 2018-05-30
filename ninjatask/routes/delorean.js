module.exports = app => {
  const Users = app.db.models.Users;
  const Tasks = app.db.models.Tasks;

  app.route("/delorean/:email")
    /**
     * @api {delete} /delorean/:email Back to the Past
     * @apiGroup Delorean
     * @apiParam {email} email User
     * @apiSuccessExample {json} Success
     *    HTTP/1.1 200 No Content
     * @apiErrorExample {json} Email not found error
     *    HTTP/1.1 404 Not Found
     * @apiErrorExample {json} Delete error
     *    HTTP/1.1 412 Precondition Failed
     */
    .delete((req, res) => {

      Users.findOne({ where: { email: req.params.email } })
        .then(user => {

          Tasks.destroy({
            where: {
              user_id: user.id
            }
          })
            .then(result => {
              Users.destroy({ where: { id: user.id } })
                .then(result => res.sendStatus(200))
                .catch(error => {
                  res.status(412).json({ msg: error.message });
                });
            })
            .catch(error => {
              res.status(412).json({ msg: error.message });
            });


        })
        .catch(error => res.sendStatus(404));
    });
};
