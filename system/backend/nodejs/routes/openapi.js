const HAXCMS = require('../lib/HAXCMS.js');

/**
   * Generate the swagger API documentation for this site
   * 
   * @OA\Post(
   *    path="/openapi/json",
   *    tags={"api"},
   *    @OA\Response(
   *        response="200",
   *        description="API documentation in JSON"
   *    )
   * )
   */
  function openapi(req, res) {
    // scan this document in order to build the Swagger docs
    // @todo make this scan multiple sources to surface user defined microservices
    openapi = \OpenApi\scan(dirname(__FILE__) + '/Operations.php');
    // dynamically add the version
    openapi.info.version = HAXCMS.getHAXCMSVersion();
    openapi.servers = [];
    openapi.servers[0] = {};
    // generate url dynamically w/ path to the API route
    openapi.servers[0].url = HAXCMS.protocol + '://' + HAXCMS.domain + HAXCMS.basePath + HAXCMS.systemRequestBase;
    openapi.servers[0].description = "Site list / dashboard for administrator user";
    // output, yaml we have to exit early or we'll get encapsulation
    if ((req.query['args']) && req.query['args'][1] == 'json') {
      return json_decode(openapi.toJson());
    }
    else {
      echo openapi.toYaml();
      exit;
    }
  }
  module.exports = openapi;