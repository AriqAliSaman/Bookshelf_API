//=\\ | Task Dicoding
//*\\ | POST
//+\\ | 1. Add Book With Complete Data
//+\\ | 2. Add Book With Finised Reading
//+\\ | 3. Add Book Without Name
//+\\ | 4. Add Book With Page Read More Than Page Count

//*\\ | GET
//+\\ | 1. Get All Book
//+\\ | 2. Get Detail Book With Correct Id
//+\\ | 3. Get Detail Finished Book
//+\\ | 4. Get Detail Book With Invalid Id

//*\\ | PUT
//+\\ | 1. Update Book With Complete Data
//+\\ | 2. Update Book Without Name
//+\\ | 3. Update Book With Page Read More Than Page Count
//+\\ | 4. Update Book With Invalid Id

//*\\ | DELETE
//+\\ | 1. Delete Book With Correct Id
//+\\ | 2. Delete Finished Book
//+\\ | 3. Delete Book With Invalid Id


const { nanoid } = require('nanoid');

const books = [];

const routes = [
  //+ Route 1: Menambahkan Buku
  {
    method: 'POST',
    path: '/books',
    handler: (request, h) => {
      const {
        name, year, author, summary, publisher, pageCount, readPage, reading
      } = request.payload;

      if (!name) {
        return h.response({
          status: 'fail',
          message: 'Gagal menambahkan buku. Mohon isi nama buku'
        }).code(400);
      }

      if (readPage > pageCount) {
        return h.response({
          status: 'fail',
          message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
        }).code(400);
      } 

      const id = nanoid(16);
      const insertedAt = new Date().toISOString();
      const updatedAt = insertedAt;
      const finished = pageCount === readPage;

      const newBook = {
        id, name, year, author, summary, publisher,
        pageCount, readPage, finished, reading, insertedAt, updatedAt
      };
      books.push(newBook);

      return h.response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
          bookId: id,
        },
      }).code(201);
    },
  },

  //+ Route 2: Mendapatkan semua buku
  {
    method: 'GET',
    path: '/books',
    handler: (request, h) => {
      const filteredBooks = books.map(book => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher
      }));

      return h.response({
        status: 'success',
        data: {
          books: filteredBooks,
        },
      }).code(200);
    },
  },

  //+ Route 3: Mendapatkan detail buku berdasarkan ID
  {
    method: 'GET',
    path: '/books/{id}',
    handler: (request, h) => {
      const { id } = request.params;
      const book = books.find(b => b.id === id);

      if (!book) {
        return h.response({
          status: 'fail',
          message: 'Buku tidak ditemukan',
        }).code(404);
      }

      return h.response({
        status: 'success',
        data: { book },
      }).code(200);
    },
  },

  //+ Route 4: Mengupdate buku berdasarkan ID
  {
    method: 'PUT',
    path: '/books/{id}',
    handler: (request, h) => {
      const { id } = request.params;
      const {
        name, year, author, summary, publisher, pageCount, readPage, reading
      } = request.payload;

      const index = books.findIndex(b => b.id === id);

      if (index === -1) {
        return h.response({
          status: 'fail',
          message: 'Gagal memperbarui buku. Id tidak ditemukan',
        }).code(404);
      }

      if (!name) {
        return h.response({
          status: 'fail',
          message: 'Gagal memperbarui buku. Mohon isi nama buku'
        }).code(400);
      }

      if (readPage > pageCount) {
        return h.response({
          status: 'fail',
          message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
        }).code(400);
      }

      const updatedAt = new Date().toISOString();
      books[index] = {
        ...books[index],
        name, year, author, summary, publisher, pageCount, readPage, reading, updatedAt,
        finished: pageCount === readPage,
      };

      return h.response({
        status: 'success',
        message: 'Buku berhasil diperbarui',
      }).code(200);
    },
  },

  //+ Route 5: Menghapus buku berdasarkan ID
  {
    method: 'DELETE',
    path: '/books/{id}',
    handler: (request, h) => {
      const { id } = request.params;
      const index = books.findIndex(b => b.id === id);

      if (index === -1) {
        return h.response({
          status: 'fail',
          message: 'Buku gagal dihapus. Id tidak ditemukan',
        }).code(404);
      }

      books.splice(index, 1);
      return h.response({
        status: 'success',
        message: 'Buku berhasil dihapus',
      }).code(200);
    },
  },
];

module.exports = routes;
