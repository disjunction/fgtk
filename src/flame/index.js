module.exports = {
    entity: {
        Thing: require('./entity/Thing')
    },
    view: {
        Webpage: require('./view/Webpage'),
        AssetManager: require('./view/AssetManager'),
        fabric: {
            FabricNodeBuilder: require('./view/fabric/FabricNodeBuilder')
        }
    }
};