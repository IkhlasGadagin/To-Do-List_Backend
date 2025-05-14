import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import Book from "./bookModel";
import cloudinary from "../config/cloudinary";
import path from "node:path";
import fs from "node:fs";
import { AuthRequest } from "../middlewares/authenticate";


const createBook = async (req: Request, res: Response, next: NextFunction) => {
    //STEPS take file from multer take the file with the variable names (coverImage and file) name and save it in the public folder
    //take the image and upload it to cloudinary
    //take the pdf and upload it to cloudinary
    //save the image and pdf url in the database
    //delete the file from the public folder fs
    const { title, description, price, genre } = req.body
    console.log(title, description, price, genre, "the data from the body");

    console.log(req.files, "the files from the request");

    // console.log("files uploaded", req.files)
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const coverImageMimeType = files?.coverImage[0].mimetype.split("/").at(-1);

    //taking the image and saving it in the public folder
    const fileName = files?.coverImage[0].filename;
    const filePath = path.resolve(__dirname, '../../public/data/uploads', fileName);

    // const { title, description, price } = req.body;
    //uploading the image to cloudinary
    try {
        const uploadResult = await cloudinary.uploader.upload(filePath, {
            filename_override: fileName,
            folder: "book-covers",
            format: coverImageMimeType,
        })
        const bookFileName = files?.file[0].filename;
        const bookFilePath = path.resolve(__dirname, '../../public/data/uploads', bookFileName);



        const bookFileUpload = await cloudinary.uploader.upload(bookFilePath, {
            resource_type: "raw",
            filename_override: bookFileName,
            folder: "book-pdf",
            format: "pdf",
        })

        // console.log(uploadResult, "the result from the cloudinary image upload");
        // console.log(bookFileUpload, "the result from the cloudinary pdf upload");

        // saving the image and pdf url in the database
        //    const userId = (req as AuthRequest).userIdi;
        const _req = req as AuthRequest;
        console.log(_req.userIdi, "From The middlewaare /////////////");

        const newBook = await Book.create({
            title,
            description,
            price,
            author: _req.userIdi,
            coverImage: uploadResult.secure_url,
            file: bookFileUpload.secure_url,
            genre: genre,
        })

        try {
            await fs.promises.unlink(filePath);
            await fs.promises.unlink(bookFilePath);
        } catch (error) {
            return next(createHttpError(500, "Error in deleting the file from the public folder"))
        }
        res.status(201).json({
            message: "Book created successfully",
            id: newBook._id
        });
    } catch (error) {
        console.log(error, "error in uploading the image to cloudinary");
        return next(createHttpError(500, "Error in uploading the image to cloudinary"));
    }

    // taking the pdf and saving it in the public folder

    // const bookFileMimeType = files?.book[0].mimetype.split("/").at(-1);


    // console.log(bookFileUpload, "bookFileUpload");




}

const getAllBooks = async (req: Request, res: Response, next: NextFunction) => {
    try {
        //get all books from the database the Pagination is the good approach
        const books = await Book.find();
        res.json({
            message: "Books fetched successfully",
            books
        });
    } catch (error) {
        return next(createHttpError(500, "Error while fetching books"))
    }
}

const getBookById = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
        const book = await Book.findById(id);
        if (!book) {
            const error = createHttpError(404, "Book not found with this id");
            return next(error);
        }
        res.json({
            message: "Book fetched successfully",
            book
        });
    } catch (error) {
        return next(createHttpError(500, "Error while fetching book"))
    }
}

const updateBook = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    console.log(id, "id of the book");
    const { title, description, price, genre } = req.body;
    console.log(title, description, price, genre, "the data from the body");
    // console.log(req.files, "the files from the request");

    try {
        const findBook = await Book.findById(id);
        if (!findBook) {
            const error = createHttpError(404, "Book not exist with this id");
            return next(error);
        }
        //check Access
        const _req = req as AuthRequest;
        if (findBook.author.toString() !== _req.userIdi) {
            const error = createHttpError(403, "You are not authorized to update this book");
            return next(error);
        }

        const files = req.files as { [fieldname: string]: Express.Multer.File[] };

        let completeCoverImage = "";
        if (files?.coverImage) {
            const fileName = files?.coverImage[0].filename;
            const coverImageMimeType = files?.coverImage[0].mimetype.split("/").at(-1);

            const filePath = path.resolve(__dirname, '../../public/data/uploads', fileName);
            //Like ikhas.png mens that below code
            completeCoverImage = fileName;
            const uploadResult = await cloudinary.uploader.upload(filePath, {
                filename_override: completeCoverImage,
                folder: "book-covers",
                format: coverImageMimeType,
            })
            completeCoverImage = uploadResult.secure_url;
            await fs.promises.unlink(filePath);

        }

        let completeFileName = "";
        if (files?.file) {
            const bookFileName = files?.file[0].filename;
            const bookFilePath = path.resolve(__dirname, '../../public/data/uploads', bookFileName);
            completeFileName = bookFileName;
            const bookFileUpload = await cloudinary.uploader.upload(bookFilePath, {
                resource_type: "raw",
                filename_override: completeFileName,
                folder: "book-pdf",
                format: "pdf",
            })
            completeFileName = bookFileUpload.secure_url;
            await fs.promises.unlink(bookFilePath);

        }

        // const updatedBook = await Book.findByIdAndUpdate(id, { title, author, description, price, genre, coverImage: completeCoverImage, file: completeFileName }, { new: true });
        const updateBook = await Book.findOneAndUpdate({ _id: id },
            { title, description, price, genre, coverImage: completeCoverImage ? completeCoverImage : findBook.coverImage, file: completeFileName ? completeFileName : findBook.file },
            { new: true });

        res.status(200).json({
            message: "Book updated successfully",
            book: updateBook
        });
    } catch (error) {
        return next(createHttpError(500, `Error while updating book ${error}`))
    }

}

const deleteBook = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

   try {
     const book = await Book.findOne({_id:id})
     if(!book){
         const error = createHttpError(404, "Book not found with this id");
         return next(error);
     }
     //check Access
     const _req = req as AuthRequest;
     if(book.author.toString() !== _req.userIdi){
         const error = createHttpError(403, "You are not authorized to delete this book");
         return next(error);
     }
     
     //delete the book from the cloudinary
     // book-covers/bkfwi5nv8eok51ernlqf
     // https://res.cloudinary.com/dbket10ds/image/upload/v1746632116/book-covers/oyjmfuxu2x5xe46mhhdr.png
     /* [
   'https:',
   '',
   'res.cloudinary.com',
   'dbket10ds',
   'image',
   'upload',
   'v1746632116',
   imp'book-covers',
   imp 'oyjmfuxu2x5xe46mhhdr.png' remove png
 ] the cover file split */
     const coverImageSplit = book.coverImage.split("/");
     const coverFileId = coverImageSplit.at(-2)+"/"+(coverImageSplit.at(-1)?.split(".").at(-2));
     console.log(coverFileId, "the cover file split");
 //for pdf its different the .pdf extension is not removed
     const bookFileSplit = book.file.split("/");
     const bookFilecloudineryId = bookFileSplit.at(-2)+"/"+bookFileSplit.at(-1);
     console.log(bookFilecloudineryId, "the book file split");
 
     await cloudinary.uploader.destroy(coverFileId);
     await cloudinary.uploader.destroy(bookFilecloudineryId,{
        resource_type: "raw"
     });
 
     //delete the book from the database
      await Book.deleteOne({_id:id});
 
    res.status(204).json({
         message: "Book deleted successfully"
     });
   } catch (error) {
    return next(createHttpError(500, "Error while deleting book"))
    
   }
}

export { createBook, getAllBooks, getBookById, updateBook, deleteBook };
