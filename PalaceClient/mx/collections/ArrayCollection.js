// Define the Array Collection class.
var ArrayCollection = ( function() {

	// I am the constructor for the array collection class.
	function Collection( data ){
		var self = this;
 
		// I am the internal data stucture used to store the
		// collection items. This must be an array - if is not,
		// then just store an empty array.
		this.data = ((data && data.isArray) ? data : [] );
 
		// I am the event manager - I am a jQuery'ized reference
		// for use with event binding / triggering. This makes use
		// of the built-in jQuery event framework that can be bound
		// to Javascript objects.
//		this.eventManager = $( this );
	}
 
 
	// I define the type of ways in which a collection can be
	// changed in a mutation event.
	Collection.CollectionEventKind = {
		ADD: "add",
		MOVE: "move",
		REMOVE: "remove",
		REPLACE: "replace",
		REFRESH: "refresh",
		RESET: "reset"
	};
 
 
	// Define the collection class methods.
	Collection.prototype = {
 
		// I add the specified item to the end of the list.
		addItem: function( item ){
			// Push the item at the end.
			this.data.push( item );
 
			// Trigger the collection change to indicate that an
			// item was added to the collection.
			this.trigger({
				type: "collectionChange",
				kind: Collection.CollectionEventKind.ADD,
				location: (this.data.length - 1),
				oldLocation: -1,
				items: [ item ]
			});
		},
 
 
		// I insert the specified item at the given index.
		addItemAt: function( item, index ){
			// Insert the item at the given index.
			this.data.splice( index, 0, item );
 
			// Trigger the collection change to indicate that an
			// item was added to the collection.
			this.trigger({
				type: "collectionChange",
				kind: Collection.CollectionEventKind.ADD,
				location: index,
				oldLocation: -1,
				items: [ item ]
			});
		},
 
 
		// I handle the binding of events to the event manager.
//		bind: function( eventType ){
//			// Pass the bind off to the event manager.
//			$.fn.bind.apply( this.eventManager, arguments );
//		},
 
 
		// I get the item stored at the given index.
		getItemAt: function( index ){
			// Return the given item.
			return( this.data[ index ] );
		},
 
 
		// I get the index of the first matching object within
		// the data collection.
		getItemIndex: function( item ){
			// Loop over the items looking for the first match.
			for( var i = 0 ; i < this.data.length ; i++){
 
				// Check to see if this item matches.
				if (this.data[ i ] == item){
 
					// Return this matching index.
					return( i );
 
				}
 
			}
 
			// If we made it this far, the item could not be found.
			// Return -1 to indicate failure.
			return( -1 );
		},
 
 
		// I remove all items from the data collection.
		removeAll: function(){
			// Reset the data collection.
			this.data = [];
 
			// Trigger the collection change to indicate that the
			// collection has been reset.
			this.trigger({
				type: "collectionChange",
				kind: Collection.CollectionEventKind.RESET,
				location: -1,
				oldLocation: -1,
				items: []
			});
		},
 
 
		// I remove the item at the given index.
		removeItemAt: function( index ){
			// Remove the item at the given index.
			var item = this.data.splice( index, 1 )[ 0 ];
 
			// Update the length.
			this.length = this.data.length;
 
			// Trigger the collection change to indicate that an
			// item was removed from the collection.
			this.trigger({
				type: "collectionChange",
				kind: Collection.CollectionEventKind.REMOVE,
				location: index,
				oldLocation: -1,
				items: [ item ]
			});
		},
 
 
		// I set the item in the given index (overridding any
		// existing value that might be there).
		setItemAt: function( item, index ){
			// Set the data into the collection at the given index.
			this.data[ index ] = item;
 
			// Trigger the collection change to indicate that an
			// item was updated within the collection.
			this.trigger({
				type: "collectionChange",
				kind: Collection.CollectionEventKind.ADD,
				location: index,
				oldLocation: -1,
				items: [ item ]
			});
		},
 
 
		// I get the current size of the collection.
		size: function(){
			return( this.data.length );
		},
 
 
		// I return an array of the internal data.
		toArray: function(){
			// Simply return the underlying array.
			return( this.data );
		}
 
 
		// I handle the triggering of events on the event manager.
//		trigger: function( options ){
//			// Pass the trigger off to the event manager.
//			$.fn.trigger.apply( this.eventManager, arguments );
//		}
 
	};
 

	// ------------------------------------------------------ //
	// ------------------------------------------------------ //

	// Return the collection class.
	return( Collection );

})();

module.exports = ArrayCollection;