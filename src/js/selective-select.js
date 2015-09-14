/*
# SelectiveSelect
*/



/*
## Select Model
*/

var SelectiveSelectModel = Backbone.Model.extend({
  defaults: function() {
    return {
      val: '',
      selected: false,
      iniVal: ''
    }
  },
  
  initialize: function() {
    _.bindAll(this, 'changeValue');
    this.on('change:val', this.changeValue);
  },
  
  changeValue: function() {
    var val = this.get('val'),
        iniVal = this.get('iniVal'),
        selected = (val != iniVal)?true:false;
    this.set('selected', selected);
  }
});



/*
## 
*/

var SelectiveSelectCollection = Backbone.Collection.extend({
  model: SelectiveSelectModel
});



/*
## 
*/

var SelectiveSelect = Backbone.View.extend({
  
  events: {
    'change .selective-select__select': 'changeSelect'
  },
  
  
  initialize: function(opt) {
    _.bindAll(this, 'changeSelect', 'switchSubmitStatus', 'isCanSubmit');
    
    var defaults = {
      target: 'all'
    };
    this.opt = _.extend(defaults, opt);
    
    this.$enabled = this.$('.selective-select__submit--enabled');
    this.$disabled = this.$('.selective-select__submit--disabled');
    this.$select = this.$('.selective-select__select');
    
    this.select = new SelectiveSelectCollection();
    this.$select.each(_.bind(function(i, me) {
      var $me = $(me),
          val = $me.val();
      this.select.add({
        val: val,
        iniVal: val
      });
    }, this));
    
    //this.disableSelect( this.$select.not(':first') );
    
    this.switchSubmitStatus();
  },
  
  
  changeSelect: function(e) {
    var $me = $(e.target),
        val = $me.val(),
        index = this.$select.index(e.target);
    
    this.select.at(index).set('val', val);
    
    this.switchSubmitStatus();
  },
  
  
  switchSubmitStatus: function(){
    if(this.isCanSubmit()){
      this.$enabled.css('display','block');
      this.$disabled.css('display','none');
    } else {
      this.$enabled.css('display','none');
      this.$disabled.css('display','block');
    }
  },
  
  
  isCanSubmit: function() {
    if('any' == this.opt.target) {
      var result = false;
      this.select.each(_.bind(function(model, index){
        var selected = model.get('selected');
        if(selected) result = true;
      }, this));
    } else {
      var result = true;
      this.select.each(_.bind(function(model, index){
        var selected = model.get('selected');
        if(!selected) result = false;
      }, this));
    }
    return result;
  }
  
});
