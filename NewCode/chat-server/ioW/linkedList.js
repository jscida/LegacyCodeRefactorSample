var LinkedList = function() {
    this._length = 0;
    this._head = null;
    this._tail = null;

    this.add = function (data) {
        var newNode = { sender: data.sender, receiver: data.receiver, date: data.date, message: data.message, next: null };
        if (this._tail) {
            this._tail.next = newNode;
            this._tail = newNode;
        } else {
            this._head = newNode;
            this._tail = newNode;
        }
        this._length++;
    }
    this.remove = function () {
        if (this._head) {
            var retVal = { sender: this._head.sender, receiver: this._head.receiver, date: this._head.date, message: this._head.message };
            if (this._head == this._tail)
                this._tail = null;
            var tmp = this._head.next;
            delete this._head.next;
            this._head = tmp;
            this._length--;
            return retVal;
        }
    }
    this.head = function () {
        return this._head;
    }
    this.count = function () {
        return this._length;
    }
}

module.exports = LinkedList;