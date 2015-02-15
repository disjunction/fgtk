module.exports = {
    entity: {
        Thing: require('./entity/Thing')
    },
    view: {
        Viewport: require('./view/Viewport'),
        Webpage: require('./view/Webpage'),
        Interactor: require('./view/Interactor'),
        AssetManager: require('./view/AssetManager'),
        StateBuilder: require('./view/StateBuilder'),
        fabric: {
            FabricNodeBuilder: require('./view/fabric/FabricNodeBuilder'),
            FabricViewport: require('./view/fabric/FabricViewport')
        }
    },
    service: {
        CosmosManager: require('./service/CosmosManager')
    }
};