module.exports = {
    entity: {
        Thing: require('./entity/Thing')
    },
    view: {
        Viewport: require('./view/Viewport'),
        Webpage: require('./view/Webpage'),
        AssetManager: require('./view/AssetManager'),
        NodeBunchBuilder: require('./view/NodeBunchBuilder'),
        fabric: {
            FabricNodeBuilder: require('./view/fabric/FabricNodeBuilder')
        }
    },
    service: {
        CosmosManager: require('./service/CosmosManager')
    }
};