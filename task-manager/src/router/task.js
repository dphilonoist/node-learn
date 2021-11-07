const express = require('express')
const Task = require('./../models/Task')

const router = new express.Router()

router.get('/tasks', async (req, res) => {
	try {
		const tasks = await Task.find({})
		res.status(201).send(tasks)
	} catch (err) {
		res.status(500).send(err)
	}
})

router.get('/tasks/:id', async (req, res) => {
	try {
		const task = await Task.findById(req.params.id)
		if (!task) {
			return res.status(404).send()
		}
		res.status(201).send(task)
	} catch (err) {
		res.status(500).send(err)
	}
})

router.post('/tasks', async (req, res) => {
	const task = new Task(req.body)
		try {
			await task.save()
			res.status(201).send(task)
    } catch (err) {
			res.status(400).send(err)
		}
})

router.patch('/tasks/:id', async (req, res) => {
	try {
		const allowedKeysToUpdate = ['completed']
		const reqKeys = Object.keys(req.body)
		const isValidOperation = reqKeys.every((allowedKey) => allowedKeysToUpdate.includes(allowedKey))
		if (!isValidOperation) {
			return res.status(404).send({ error: 'Invalid updates' })
		}
		const task = await Task.findById(req.params.id)
		reqKeys.forEach((key) => task[key] = req.body[key])
		await task.save()
		if (!task) {
			return res.status(404).send()
		}
		res.send(task)
	} catch (err) {
		res.status(400).send(err)
	}
})

router.delete('/tasks/:id', async (req, res) => {
	try {
		const task = await Task.findByIdAndDelete(req.params.id)
		if (!task) {
			return res.status(404).send()
		}
		res.send(task)
	} catch (err) {
		res.status(500).send(err)
	}
})

module.exports = router