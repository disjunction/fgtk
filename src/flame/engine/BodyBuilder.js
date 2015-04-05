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
        return new Error(message + ', plan:' + this.opts.cosmosManager.identifyPlan(plan));
    },
    
    createDefaultBody: function(extra) {
        extra = extra || smog.EMPTY;
        var bd = new b2.BodyDef();
        bd.type = b2.Body.b2_dynamicBody;
        bd.linearDamping = extra.linearDamping || 0.7;
        bd.angularDamping = extra.angularDamping || 1;
        return this.opts.world.CreateBody(bd);
    },
    
    makePolygon: function(plan, extra) {
        var shape = new b2.PolygonShape();
        if (!plan.body.vertices) {
            throw this.planError('vertices array is required for polygon body', plan);
        }
        var b2Vertices = [],
            vec, rot;
        for (var i = 0; i < plan.body.vertices.length; i++) {
            vec = new b2.Vec2(plan.body.vertices[i][0], plan.body.vertices[i][1]);
            
            if (plan.body.a) {
                rot = new b2.Rot(plan.body.a / 180 * Math.PI);
                vec = b2.Mul_r_v2(rot, vec);
            }
            
            b2Vertices.push(vec);
        }
        shape.Set(b2Vertices, b2Vertices.length);
        var body = this.createDefaultBody(extra);
        body.CreateFixture(shape, 5.0);
        return body;
    },
    
    makeBox: function(plan, extra) {
        if (plan.a) {
            throw this.planError("box body doesn't support angle", plan);
        }
        
        var shape = new b2.PolygonShape(extra);
        shape.SetAsBox(plan.body.size.width / 2, plan.body.size.height  / 2);

        var body = this.createDefaultBody(extra);
        body.CreateFixture(shape, 5.0);
        return body;
    },
    
    makeBrick:  function(plan, extra) {
        var node = this.opts.cosmosManager.thingPlanHelper.getPrimaryNode(plan);
        if (node) {
            var size = this.opts.assetManager.getSize(node.src),
                ppm = this.opts.config.ppm;

            size = this.fixSizeByPlan(node, size);

            var shape = new b2.PolygonShape();
            shape.SetAsBox(size.width / ppm / 2, size.height  / ppm  / 2);

            var body = this.createDefaultBody(extra);
            body.CreateFixture(shape, 5.0);
            return body;
        } else {
            throw this.planError('cannot find primary node for a brick', plan);
        }
    },
    
    makeBody: function(plan, extra) {
        if (!plan.body) {
            throw this.planError('cannot create a body', plan);
        }
        
        if (plan.body == 'brick') {
            return this.makeBrick(plan, extra);
        }
        
        switch (plan.body.type) {
            case 'polygon': return this.makePolygon(plan, extra);
            case 'box': return this.makeBox(plan, extra);
            default:
                throw new Error('unkown body type: ' + plan.body.type);
        }
        
        
    }
});

module.exports = BodyBuilder;