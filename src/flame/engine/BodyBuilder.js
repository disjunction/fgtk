var b2 = require('jsbox2d'),
    cc = require('cc'),
    smog = require('smog');

var BodyBuilder = cc.Class.extend({
    /**
     * opts:
     * * world - b2.World 
     * * cosmosManager
     * * assetManager
     * * config
     * @param opts object
     */
    ctor: function(opts) { 
        this.opts = opts;
    },
    
    fixSizeByPlan: function(nodePlan, size) {
        if (nodePlan.subrect) {
            size = cc.size(nodePlan.subrect[2], nodePlan.subrect[3]);
        }
        
        var s = this.opts.cosmosManager.thingPlanHelper.getNodeScale(nodePlan);
        if (s) {
            if (s.x) size.width *= s.x;
            if (s.y) size.height *= s.y;
        }
        if (nodePlan.a == 90 || nodePlan.a == 270) {
            var t = size.width;
            size.width = size.height;
            size.height = t;
        }
        return size;
    },

    planError: function(message, plan) {
        if (!plan) {
            plan = this.tmpPlan;
        }
        throw new Error(message + ', plan:' + this.opts.cosmosManager.identifyPlan(plan));
        //return new Error(message + ', plan:' + this.opts.cosmosManager.identifyPlan(plan));
    },
    
    createDefaultBody: function(plan, extra) {
        extra = extra || smog.EMPTY;
        var bd = new b2.BodyDef();
        if (plan.static) {
            bd.type = b2.Body.b2_staticBody;
            bd.friction = extra.friction || 2000;
        } else {
            bd.type = b2.Body.b2_dynamicBody;
            bd.linearDamping = extra.linearDamping || 0.7;
            bd.angularDamping = extra.angularDamping || 1;
        }
        return this.opts.world.CreateBody(bd);
    },
    
    addShapePolygon: function(body, shapePlan) {
        if (!shapePlan.vertices) {
            throw this.planError('vertices array is required for polygon body');
        }
        var shape = new b2.PolygonShape();
        
        var b2Vertices = [],
            vec, rot;
        for (var i = 0; i < shapePlan.vertices.length; i++) {
            vec = new b2.Vec2(shapePlan.vertices[i][0], shapePlan.vertices[i][1]);
            
            if (shapePlan.a) {
                rot = new b2.Rot(shapePlan.a / 180 * Math.PI);
                vec = b2.Mul_r_v2(rot, vec);
            }
            
            b2Vertices.push(vec);
        }
        shape.Set(b2Vertices, b2Vertices.length);
        body.CreateFixture(shape, 5.0);
    },
    
    addShapeBox: function(body, shapePlan) {
        if (shapePlan.a) {
            throw this.planError("box body doesn't support angle");
        }
        
        var shape = new b2.PolygonShape();
        shape.SetAsBox(shapePlan.size.width / 2, shapePlan.size.height  / 2);
        body.CreateFixture(shape, 5.0);
    },
    
    addShapeCircle: function(body, shapePlan) {      
        var shape = new b2.CircleShape();
        shape.m_radius = shapePlan.radius;
        body.CreateFixture(shape, 5.0);
    },
    
    addShape: function(body, shapePlan) {
        switch (shapePlan.type) {
            case 'polygon': return this.addShapePolygon(body, shapePlan);
            case 'circle': return this.addShapeCircle(body, shapePlan);
            case 'box': return this.addShapeBox(body, shapePlan);
            default:
                throw new Error('unkown shape type: ' + shapePlan);
        }
    },
    
    makeBrick:  function(plan, extra) {
        var node = this.opts.cosmosManager.thingPlanHelper.getPrimaryNode(plan);
        if (node) {
            var size = this.opts.assetManager.getSize(node.src),
                ppm = this.opts.config.ppm;

            size = this.fixSizeByPlan(node, size);

            var shape = new b2.PolygonShape();
            shape.SetAsBox(size.width / ppm / 2, size.height  / ppm  / 2);

            var body = this.createDefaultBody(plan, extra);
            body.CreateFixture(shape, 5.0);
            return body;
        } else {
            throw this.planError('cannot find primary node for a brick', plan);
        }
    },
    
    
    makeBody: function(plan, extra) {
        this.tmpPlan = plan;
        
        if (!plan.body) {
            throw this.planError('cannot create a body', plan);
        }
        
        if (plan.body == 'brick') {
            return this.makeBrick(plan, extra);
        }
        
        var body = this.createDefaultBody(plan, extra);
        
        if (plan.body.shapes) {
            for (var i = 0; i < plan.body.shapes.length; i++) {
                if (!plan.body.shapes[i].skip) {
                    this.addShape(body, plan.body.shapes[i]);
                }
            }
        } else {
            this.addShape(body, plan.body);
        }
        
        return body;
    }
});

module.exports = BodyBuilder;
