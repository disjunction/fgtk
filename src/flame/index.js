module.exports = {
    engine: {
        EgoProtagonist: require('./engine/EgoProtagonist'),
        FieldEngine: require('./engine/FieldEngine'),
        BodyBuilder: require('./engine/BodyBuilder')
    },
    entity: {
        Thing: require('./entity/Thing'),
        Field: require('./entity/Field')
    },
    rof: {
        Driver: require('./rof/Driver')
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
        },
        cocos: {
            CocosNodeBuilder: require('./view/cocos/CocosNodeBuilder'),
            CocosViewport: require('./view/cocos/CocosViewport')
        }
    },
    service: {
        CosmosManager: require('./service/CosmosManager'),
        ThingPlanHelper: require('./service/ThingPlanHelper')
    }
};