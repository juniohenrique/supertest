module.exports = app => {
  const Users = app.db.models.Users;
  const Tasks = app.db.models.Tasks;

  app.route("/user")
    .all(app.auth.authenticate())
    /**
     * @api {get} /user Return the authenticated user's data
     * @apiGroup User
     * @apiHeader {String} Authorization Token of authenticated user
     * @apiHeaderExample {json} Header
     *    {"Authorization": "JWT xyz.abc.123.hgf"}
     * @apiSuccess {Number} id User id
     * @apiSuccess {String} name User name
     * @apiSuccess {String} email User email
     * @apiSuccessExample {json} Success
     *    HTTP/1.1 200 OK
     *    {
     *      "id": 1,
     *      "name": "Tony Stark",
     *      "email": "tony@stark.com"
     *    }
     * @apiErrorExample {json} Find error
     *    HTTP/1.1 412 Precondition Failed
     */
    .get((req, res) => {
      Users.findById(req.user.id, {
        attributes: ["id", "name", "email"]
      })
        .then(result => res.json(result))
        .catch(error => {
          res.status(412).json({ msg: error.message });
        });
    })
    /**
     * @api {delete} /user Deletes an authenticated user
     * @apiGroup User
     * @apiHeader {String} Authorization Token of authenticated user
     * @apiHeaderExample {json} Header
     *    {"Authorization": "JWT xyz.abc.123.hgf"}
     * @apiSuccessExample {json} Success
     *    HTTP/1.1 204 No Content
     * @apiErrorExample {json} Delete error
     *    HTTP/1.1 412 Precondition Failed
     */
    .delete((req, res) => {

      Tasks.destroy({
        where: {
          user_id: req.user.id
        }
      })
        .then(result => {
          Users.destroy({ where: { id: req.user.id } })
            .then(result => res.sendStatus(204))
            .catch(error => {
              res.status(412).json({ msg: error.message });
            });
        })
        .catch(error => {
          res.status(412).json({ msg: error.message });
        });


    });

  /**
   * @api {post} /users Register a new user
   * @apiGroup User
   * @apiParam {String} name User name
   * @apiParam {String} email User email
   * @apiParam {String} password User password
   * @apiParamExample {json} Input
   *    {
   *      "name": "Tony Stark",
   *      "email": "tony@stark.com",
   *      "password": "123456"
   *    }
   * @apiSuccess {Number} id User id
   * @apiSuccess {String} name User name
   * @apiSuccess {String} email User email
   * @apiSuccess {String} password User encrypted password
   * @apiSuccess {Date} updated_at Update's date
   * @apiSuccess {Date} created_at Register's date
   * @apiSuccessExample {json} Success
   *    HTTP/1.1 200 OK
   *    {
   *      "id": 1,
   *      "name": "Tony Stark",
   *      "email": "tony@stark.com",
   *      "password": "$2a$10$SK1B1",
   *      "updated_at": "2016-02-10T15:20:11.700Z",
   *      "created_at": "2016-02-10T15:29:11.700Z"
   *    }
   * @apiError DuplicateEmail Email can not duplicated.
   *
   * @apiErrorExample DuplicateEmail:
   *     HTTP/1.1 409 Conflit
   *     {
   *       "msg": "Oops. Looks like you already have an account with this email address."
   *     }
   * 
   * @apiError InvalidEmail Email should be valid
   * 
   * @apiErrorExample InvalidEmail:
   *     HTTP/1.1 412 Precondition Failed
   *     {
   *       "msg": "Oops. The email you entered is invalid."
   *     }
   * 
   * @apiError NotEmpty Name, email and password is not empty
   * 
   * @apiErrorExample NotEmpty:
   *     HTTP/1.1 412 Precondition Failed
   *     {
   *       "msg": "Validation notEmpty failed"
   *     }
   * @apiError NotNull Name, email and password is not null
   * 
   * @apiErrorExample NotNull:
   *     HTTP/1.1 412 Precondition Failed
   *     {
   *       "msg": "Field cannot be null"
   *     }
   */


  app.post("/users", (req, res) => {

    Users.create(req.body)
      .then(result => res.json(result))
      .catch(error => {
        var firstError = error.errors[0];

        var statusCode = 412;
        let result = {
          msg: firstError.message.capitalize()
        }

        if (firstError.type == 'unique violation') {
          statusCode = 409
        }

        res.status(statusCode).json(result);
      });

  });
};
