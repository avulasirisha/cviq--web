App.service('promoService', function() {
    var promo_id = '' ;

    var add_promo_id = function(id) {
        promo_id = id;
    }

    var get_promo_id = function(){
        return promo_id;
    }

    return {
        add_promo_id: add_promo_id,
        get_promo_id: get_promo_id
    };

});

