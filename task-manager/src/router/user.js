const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const User = require('./../models/User')
const auth = require('./../middleware/auth')

const router = new express.Router()

router.get('/users/me', auth ,async (req, res) => {
    res.send(req.user)
})

// router.get('/users/:id', async (req, res) => {
//     try {
// 			const user = await User.findById(req.params.id)
// 			if (!user) {
// 				return res.status(404).send()
// 			}
// 			res.status(201).send(user)
//     } catch (err) {
// 			res.status(500).send(err)
// 		}
// })

router.post('/users', async (req, res) => {
		try {
			const user = new User(req.body)
			const token = await user.generateAuthToken()
			await user.save()
			res.status(201).send({user, token})
    } catch (err) {
			res.status(400).send(err)
		}
})

router.post('/users/login', async (req, res) => {
		try {
			const { email, password } = req.body
			const user = await User.findByCredentials(email, password)
			const token = await user.generateAuthToken()
			res.send({user, token})
    } catch (err) {
			res.status(400).send(err)
		}
})

router.post('/users/logout', auth, async (req, res) => {
	try {
		req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token)
		await req.user.save()
		res.send()
} catch (err) {
		res.status(400).send(err)
	}
})

router.post('/users/logoutall', auth, async (req, res) => {
	try {
		req.user.tokens = []
		await req.user.save()
		res.send()
} catch (err) {
		res.status(400).send(err)
	}
})

const upload = multer({
	// dest: 'avatars',
	limits: {
		fileSize: 1000000,
	},
	fileFilter(req, file, cb) {
		// if (!file.originalname.endsWith('.pdf')) {
		// 	return cb(new Error('Please upload a valid file.'))
		// }
		if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload a Word document'))
        }
		cb(undefined, true)
		// cb(undefined, file)
	}
})

router.get('/users/:id/avatar', async (req, res) => {
	try {
		const user = await User.findById(req.params.id)
		if (!user || !user.avatar) {
			throw new Error()
		}
		res.set('Content-Type', 'image/jpg')
		res.send(user.avatar)
	} catch (err) {
		res.status(400).send(err)
	}
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
	const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).toBuffer()
	req.user.avatar = buffer
	// this buffer is accessible when we don't set dest in mutler
	await req.user.save()
	res.send()
}, (err, req, res, next) => {
	// to handle mutler error
	res.status(400).send({error: err.message}) 
})

router.delete('/users/me/avatar', auth, async (req, res) => {
	try {
		req.user.avatar = undefined
		await req.user.save()
		res.send()
	} catch (err) {
		res.status(400).send(err)
	}
})

router.patch('/users/me', auth, async (req, res) => {
	try {
		const allowedKeysToUpdate = ['name', 'email', 'age', 'password']
		const reqKeys = Object.keys(req.body)
		const isValidOperation = reqKeys.every((allowedKey) => allowedKeysToUpdate.includes(allowedKey))
		if (!isValidOperation) {
			return res.status(404).send({ error: 'Invalid updates' })
		}
		// const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }) This wont run middlewarws
		// const user = await User.findById(req.params.id)
		reqKeys.forEach((key) => req.user[key] = req.body[key])
		await req.user.save()
		res.send(req.user)
	} catch (err) {
		res.status(400).send(err)
	}
})

router.delete('/users/me', auth, async (req, res) => {
	try {
		// const user = await User.findByIdAndDelete(req.user._id)
		// if (!user) {
		// 	return res.status(404).send()
		// }
		await req.user.remove()
		res.send(req.user)
	} catch (err) {
		res.status(500).send(err)
	}
})

module.exports = router