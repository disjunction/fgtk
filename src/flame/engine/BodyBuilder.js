var b2 = require('jsbox2d'),
    cc = require('cc');

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
    
    makeBody: function(plan) {
        if (!plan.body) {
            throw new Error('cannot create a body for plan ' + this.opts.cosmosManager.identifyPlan(plan));
        }
        if (plan.body == 'brick') {
            var node = this.opts.cosmosManager.thingPlanHelper.getPrimaryNode(plan);
            if (node) {
                var bd = new b2.BodyDef();
                bd.type = b2.Body.b2_dynamicBody;
                bd.position.Set(0.0, 0.0);
                
                var size = this.opts.assetManager.getSize(node.src),
                    ppm = this.opts.config.ppm;
                
                console.log(node);
                size = this.fixSizeByPlan(node, size);
               
                var shape = new b2.PolygonShape();
                shape.SetAsBox(size.width / ppm / 2, size.height  / ppm  / 2);
                
                var body = this.opts.world.CreateBody(bd);
                body.CreateFixture(shape, 5.0);
                return body;
            } else {
                throw new Error('cannot find primary node for a brick ' + this.opts.cosmosManager.identifyPlan(plan));
            }
        }
    }
});

module.exports = BodyBuilder;